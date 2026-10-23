import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from './types.js';
import { db } from './db.js';

const SESSION_SECRET = process.env.SESSION_SECRET || 'roka-mall-super-secret-key-bridal-trousseau-2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Password hashing with PBKDF2
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
  } catch {
    return false;
  }
}

// Token generation and verification
interface TokenPayload {
  userId: string;
  role: UserRole;
  exp: number;
}

export function generateToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Payload).digest('base64url');
  return `${base64Payload}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64Payload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Payload).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const payload: TokenPayload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// In-memory rate limiting for login endpoints
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 min window
    return true;
  }
  if (record.count >= 10) {
    return false;
  }
  record.count += 1;
  return true;
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

// Middleware: Authenticate user from Authorization header
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'الرجاء تسجيل الدخول أولاً للمتابعة' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'جلسة تسجيل الدخول منتهية أو غير صالحة' });
    return;
  }

  const user = db.getUserById(payload.userId);
  if (!user) {
    res.status(401).json({ error: 'المستخدم غير موجود' });
    return;
  }

  req.user = user;
  next();
}

// Middleware: Require Admin (Manager or Assistant)
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || (req.user.role !== 'manager' && req.user.role !== 'assistant')) {
    res.status(403).json({ error: 'غير مصرح لك بالوصول إلى لوحة التحكم' });
    return;
  }
  next();
}

// Middleware: Require Manager Only (Bishara Ayoub role)
export function requireManager(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'manager') {
    res.status(403).json({ error: 'هذا الإجراء مخصص لمدير المتجر فقط (بشاره ايوب)' });
    return;
  }
  next();
}
