import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../auth.js';
import { db } from '../db.js';

const router = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('صيغة الملف غير مدعومة. يُرجى رفع صور بصيغة JPG أو PNG أو WebP فقط'));
    }
  },
});

router.post('/', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'حجم الصورة كبير جداً، الحد الأقصى المسموح به هو 5 ميجابايت' });
        return;
      }
      res.status(400).json({ error: err.message || 'فشل رفع الصورة' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'يرجى اختيار ملف صورة للرفع' });
      return;
    }

    const publicUrl = `/uploads/${req.file.filename}`;

    db.addAuditLog({
      id: `log-${Date.now()}`,
      adminId: req.user!.id,
      adminName: req.user!.name,
      action: 'رفع صورة منتج',
      details: `قام ${req.user!.name} برفع صورة جديدة (${req.file.filename}).`,
      ip: req.ip,
      createdAt: new Date().toISOString(),
    });

    res.json({
      message: 'تم رفع الصورة بنجاح',
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
});

export default router;
