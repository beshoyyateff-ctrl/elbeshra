import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../auth.js';

const router = Router();

// GET notifications (Admin only)
router.get('/', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const notifications = db.getNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  res.json({
    unreadCount,
    notifications,
  });
});

// Mark single notification as read
router.patch('/:id/read', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const success = db.markNotificationAsRead(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'الإشعار غير موجود' });
    return;
  }
  res.json({ message: 'تم تحديث الإشعار' });
});

// Mark all notifications as read
router.post('/mark-all-read', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  db.markAllNotificationsAsRead();
  res.json({ message: 'تم تحديد جميع الإشعارات كمقروءة' });
});

export default router;
