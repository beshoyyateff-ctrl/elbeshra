import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  checkRateLimit,
  resetRateLimit,
  authenticate,
  AuthenticatedRequest,
} from '../auth.js';
import { User } from '../types.js';

const router = Router();
const ADMIN_SETUP_TOKEN = process.env.ADMIN_SETUP_TOKEN || 'roka-initial-setup-key-2026';

// Check if first-manager setup is needed
router.get('/setup-status', (_req: Request, res: Response) => {
  const manager = db.getUsers().find(u => u.name === 'بشاره ايوب' && u.role === 'manager');
  const isManagerConfigured = !!(manager && manager.isPasswordSet);
  res.json({
    isManagerConfigured,
    managerName: manager?.name || 'بشاره ايوب',
    assistantName: 'توماس ايوب',
  });
});

// Setup admin password for Bishara Ayoub (Manager) and optionally Thomas Ayoub (Assistant)
router.post('/setup-admin', (req: Request, res: Response) => {
  const { managerPassword, assistantPassword, setupToken } = req.body;

  const manager = db.getUsers().find(u => u.name === 'بشاره ايوب' && u.role === 'manager');
  if (!manager) {
    res.status(500).json({ error: 'لم يتم العثور على سجل المدير (بشاره ايوب) في النظام' });
    return;
  }

  // If already configured, require setupToken to override
  if (manager.isPasswordSet && setupToken !== ADMIN_SETUP_TOKEN) {
    res.status(403).json({ error: 'تم إعداد كلمة مرور المدير مسبقاً. يلزم إدخال رمز التهيئة الإداري المعتمد للتعديل.' });
    return;
  }

  if (!managerPassword || managerPassword.length < 6) {
    res.status(400).json({ error: 'يجب ألا تقل كلمة مرور المدير عن 6 خانات' });
    return;
  }

  const { hash: managerHash, salt: managerSalt } = hashPassword(managerPassword);
  db.updateUser(manager.id, {
    passwordHash: managerHash,
    salt: managerSalt,
    isPasswordSet: true,
  });

  // Assistant setup if provided
  const assistant = db.getUsers().find(u => u.name === 'توماس ايوب' && u.role === 'assistant');
  if (assistant && assistantPassword && assistantPassword.length >= 6) {
    const { hash: aHash, salt: aSalt } = hashPassword(assistantPassword);
    db.updateUser(assistant.id, {
      passwordHash: aHash,
      salt: aSalt,
      isPasswordSet: true,
    });
  }

  // Audit log
  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: manager.id,
    adminName: manager.name,
    action: 'تهيئة الحسابات الإدارية',
    details: 'تم تعيين كلمة مرور المدير (بشاره ايوب) وحسابات الإدارة بنجاح وبطريقة مشفرة.',
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  const token = generateToken(manager);
  res.json({
    message: 'تم إعداد حساب الإدارة للمدير بشاره ايوب بنجاح',
    token,
    user: {
      id: manager.id,
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      role: manager.role,
    },
  });
});

// Admin Login (for Manager & Assistant)
router.post('/quick-admin-login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'يرجى إدخال كلمه السر يا مستر' });
    return;
  }

  const manager = db.getUsers().find(u => u.name === 'بشاره ايوب' && u.role === 'manager') || db.getUsers().find(u => u.role === 'manager');
  if (!manager) {
    res.status(500).json({ error: 'لم يتم العثور على سجل المدير في النظام' });
    return;
  }

  const isMasterPassword = password.trim() === 'Beshara#012#';
  const isHashValid = manager.isPasswordSet && verifyPassword(password, manager.passwordHash, manager.salt);

  if (!isMasterPassword && !isHashValid) {
    res.status(401).json({ error: 'كلمة السر غير صحيحة، يرجى المحاولة مرة أخرى يا مستر' });
    return;
  }

  // Ensure manager password hash is synced with master password
  if (isMasterPassword && (!manager.isPasswordSet || !isHashValid)) {
    const { hash, salt } = hashPassword('Beshara#012#');
    db.updateUser(manager.id, {
      passwordHash: hash,
      salt,
      isPasswordSet: true,
    });
  }

  // Log action
  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: manager.id,
    adminName: manager.name,
    action: 'تسجيل دخول إداري بكلمة السر المباشرة',
    details: `تم الدخول للوحة التحكم بنجاح للمدير (${manager.name}) بكامل الصلاحيات.`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  const token = generateToken(manager);
  res.json({
    message: 'أهلاً بك يا مستر بشاره، تم تسجيل الدخول بنجاح',
    token,
    user: {
      id: manager.id,
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      role: manager.role,
    },
  });
});

// Admin Login (for Manager & Assistant)
router.post('/admin-login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: 'تم تجاوز عدد محاولات الدخول المسموح بها. يرجى الانتظار 15 دقيقة والمحاولة مجدداً.' });
    return;
  }

  const { identifier, password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'يرجى إدخال كلمه السر يا مستر' });
    return;
  }

  // If password is the master password Beshara#012#, immediately authenticate as manager
  if (password.trim() === 'Beshara#012#') {
    const manager = db.getUsers().find(u => u.name === 'بشاره ايوب' && u.role === 'manager') || db.getUsers().find(u => u.role === 'manager');
    if (manager) {
      if (!manager.isPasswordSet || !verifyPassword(password, manager.passwordHash, manager.salt)) {
        const { hash, salt } = hashPassword('Beshara#012#');
        db.updateUser(manager.id, {
          passwordHash: hash,
          salt,
          isPasswordSet: true,
        });
      }

      resetRateLimit(ip);

      db.addAuditLog({
        id: `log-${Date.now()}`,
        adminId: manager.id,
        adminName: manager.name,
        action: 'تسجيل دخول إداري بكلمة السر الرئيسية',
        details: `قام المدير العام (${manager.name}) بالدخول عبر كلمة السر المعتمدة.`,
        ip,
        createdAt: new Date().toISOString(),
      });

      const token = generateToken(manager);
      res.json({
        token,
        user: {
          id: manager.id,
          name: manager.name,
          email: manager.email,
          phone: manager.phone,
          role: manager.role,
        },
      });
      return;
    }
  }

  const users = db.getUsers();
  const trimmed = identifier ? identifier.trim().toLowerCase() : '';
  const admin = users.find(u =>
    (u.role === 'manager' || u.role === 'assistant') &&
    (trimmed === '' || u.email.toLowerCase() === trimmed || u.name.toLowerCase() === trimmed || u.phone === trimmed)
  );

  if (!admin) {
    res.status(401).json({ error: 'بيانات الدخول غير صحيحة، أو الحساب ليس له صلاحيات إدارية' });
    return;
  }

  if (!admin.isPasswordSet) {
    res.status(400).json({
      error: 'لم يتم تعيين كلمة المرور لهذا الحساب بعد. يرجى إتمام التهيئة الأولى من شاشة إعداد المدير.',
      requiresSetup: true,
    });
    return;
  }

  if (!verifyPassword(password, admin.passwordHash, admin.salt)) {
    res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    return;
  }

  resetRateLimit(ip);

  // Log action
  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: admin.id,
    adminName: admin.name,
    action: 'تسجيل دخول إداري',
    details: `قام ${admin.name} (${admin.role === 'manager' ? 'المدير' : 'المساعد'}) بتسجيل الدخول للوحة التحكم.`,
    ip,
    createdAt: new Date().toISOString(),
  });

  const token = generateToken(admin);
  res.json({
    token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    },
  });
});

// Customer Registration
router.post('/register', (req: Request, res: Response) => {
  const { name, phone, email, password, address, city } = req.body;

  if (!name || name.trim().length < 2) {
    res.status(400).json({ error: 'يرجى إدخال الاسم بالكامل' });
    return;
  }

  if (!phone || phone.trim().length < 10) {
    res.status(400).json({ error: 'يرجى إدخال رقم هاتف أو واتساب صحيح' });
    return;
  }

  if (!password || password.length < 6) {
    res.status(400).json({ error: 'كلمة المرور يجب أن لا تقل عن 6 خانات' });
    return;
  }

  const existingPhone = db.getUserByPhone(phone.trim());
  if (existingPhone) {
    res.status(400).json({ error: 'رقم الهاتف مسجل لدينا بالفعل، يمكنك تسجيل الدخول مباشرة' });
    return;
  }

  if (email && email.trim()) {
    const existingEmail = db.getUserByEmail(email.trim());
    if (existingEmail) {
      res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل' });
      return;
    }
  }

  const { hash, salt } = hashPassword(password);
  const newUser: User = {
    id: `cust-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || `${phone.trim()}@customer.rokamall.com`,
    role: 'customer',
    passwordHash: hash,
    salt,
    address: address?.trim() || '',
    city: city?.trim() || 'جهينة، سوهاج',
    isPasswordSet: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.addUser(newUser);

  // Notify admin dashboard immediately
  db.addNotification({
    id: `notif-${Date.now()}`,
    type: 'new_customer',
    title: 'تسجيل عميل جديد في روكا مول',
    message: `العميلة/العميل ${newUser.name} سجل حساباً جديداً برقم ${newUser.phone} من ${newUser.city || 'سوهاج'}.`,
    isRead: false,
    data: {
      customerId: newUser.id,
      customerName: newUser.name,
      customerPhone: newUser.phone,
      customerCity: newUser.city,
    },
    createdAt: new Date().toISOString(),
  });

  const token = generateToken(newUser);
  res.status(201).json({
    message: 'تم إنشاء حسابكِ بنجاح في روكا مول',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      address: newUser.address,
      city: newUser.city,
      role: newUser.role,
    },
  });
});

// Customer Login
router.post('/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: 'محاولات دخول كثيرة خاطئة، يرجى الانتظار والمحاولة لاحقاً' });
    return;
  }

  const { identifier, password } = req.body;
  if (!identifier || !password) {
    res.status(400).json({ error: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني وكلمة المرور' });
    return;
  }

  const trimmed = identifier.trim().toLowerCase();
  const user = db.getUsers().find(u =>
    u.phone === trimmed ||
    u.email.toLowerCase() === trimmed
  );

  if (!user || !user.isPasswordSet || !verifyPassword(password, user.passwordHash, user.salt)) {
    res.status(401).json({ error: 'رقم الهاتف/البريد أو كلمة المرور غير صحيحة' });
    return;
  }

  resetRateLimit(ip);

  const token = generateToken(user);
  res.json({
    message: 'تم تسجيل الدخول بنجاح',
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      city: user.city,
      role: user.role,
    },
  });
});

// Get Current User Profile
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const u = req.user!;
  res.json({
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email,
    address: u.address,
    city: u.city,
    role: u.role,
    notes: u.notes,
    createdAt: u.createdAt,
  });
});

// Update Profile
router.put('/update-profile', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { name, phone, address, city } = req.body;
  const user = req.user!;

  if (name && name.trim().length < 2) {
    res.status(400).json({ error: 'الاسم المدخل قصير جداً' });
    return;
  }

  const updated = db.updateUser(user.id, {
    name: name?.trim() || user.name,
    phone: phone?.trim() || user.phone,
    address: address !== undefined ? address.trim() : user.address,
    city: city !== undefined ? city.trim() : user.city,
  });

  res.json({
    message: 'تم تحديث بياناتك بنجاح',
    user: {
      id: updated!.id,
      name: updated!.name,
      phone: updated!.phone,
      email: updated!.email,
      address: updated!.address,
      city: updated!.city,
      role: updated!.role,
    },
  });
});

// Change Password
router.put('/change-password', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user!;

  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن لا تقل عن 6 خانات' });
    return;
  }

  if (user.isPasswordSet && !verifyPassword(oldPassword, user.passwordHash, user.salt)) {
    res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    return;
  }

  const { hash, salt } = hashPassword(newPassword);
  db.updateUser(user.id, {
    passwordHash: hash,
    salt,
    isPasswordSet: true,
  });

  if (user.role === 'manager' || user.role === 'assistant') {
    db.addAuditLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'تغيير كلمة المرور',
      details: `قام ${user.name} بتحديث كلمة المرور الخاصة بحسابه الإداري.`,
      ip: req.ip,
      createdAt: new Date().toISOString(),
    });
  }

  res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
});

export default router;
