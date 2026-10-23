import { Router, Response } from 'express';
import { db } from '../db.js';
import {
  authenticate,
  requireAdmin,
  requireManager,
  AuthenticatedRequest,
  hashPassword,
} from '../auth.js';
import { User } from '../types.js';

const router = Router();

// GET admin dashboard overview metrics
router.get('/overview', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const products = db.getProducts();
  const categories = db.getCategories();
  const users = db.getUsers();
  const customers = users.filter(u => u.role === 'customer');
  const notifications = db.getNotifications();
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const recentCustomers = customers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      city: c.city || 'سوهاج',
      createdAt: c.createdAt,
    }));
  const auditLogs = db.getAuditLogs().slice(0, 10);

  res.json({
    metrics: {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalCustomers: customers.length,
      unreadNotifications,
      activeAdmins: users.filter(u => u.role === 'manager' || u.role === 'assistant').length,
    },
    recentCustomers,
    recentLogs: auditLogs,
  });
});

// GET admin users list
router.get('/users', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const admins = db.getUsers()
    .filter(u => u.role === 'manager' || u.role === 'assistant')
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isPasswordSet: u.isPasswordSet,
      notes: u.notes,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

  res.json(admins);
});

// Update admin password or permissions (Manager only)
router.put('/users/:id/password', authenticate, requireManager, (req: AuthenticatedRequest, res: Response) => {
  const targetUser = db.getUserById(req.params.id);
  if (!targetUser || (targetUser.role !== 'manager' && targetUser.role !== 'assistant')) {
    res.status(404).json({ error: 'المستخدم الإداري غير موجود' });
    return;
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'كلمة المرور الجديدة يجب ألا تقل عن 6 خانات' });
    return;
  }

  const { hash, salt } = hashPassword(newPassword);
  db.updateUser(targetUser.id, {
    passwordHash: hash,
    salt,
    isPasswordSet: true,
  });

  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: req.user!.id,
    adminName: req.user!.name,
    action: 'إعادة تعيين كلمة مرور إدارية',
    details: `قام المدير العام (${req.user!.name}) بإعادة تعيين كلمة المرور لحساب ${targetUser.name} (${targetUser.role === 'manager' ? 'المدير' : 'المساعد'}).`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  res.json({ message: `تم تحديث كلمة المرور لـ ${targetUser.name} بنجاح` });
});

// GET audit logs
router.get('/audit-logs', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const logs = db.getAuditLogs();
  res.json(logs);
});

export default router;
