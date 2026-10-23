import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../auth.js';

const router = Router();

// GET store settings (Public)
router.get('/', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json(settings);
});

// PUT update store settings & policies (Admin only)
router.put('/', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const updates = req.body;

  // If changing policies, require Manager role (Bishara Ayoub)
  const isChangingPolicies =
    updates.privacyPolicy !== undefined ||
    updates.termsAndConditions !== undefined ||
    updates.returnPolicy !== undefined;

  if (isChangingPolicies && user.role !== 'manager') {
    res.status(403).json({ error: 'تعديل السياسات والشروط القانونية مقتصر على المدير العام (بشاره ايوب).' });
    return;
  }

  const updated = db.updateSettings(updates);

  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: user.id,
    adminName: user.name,
    action: 'تحديث إعدادات المتجر',
    details: `قام ${user.name} بتحديث إعدادات ومعلومات المتجر والسياسات.`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  res.json({
    message: 'تم حفظ الإعدادات بنجاح',
    settings: updated,
  });
});

export default router;
