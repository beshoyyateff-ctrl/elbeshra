import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../auth.js';
import { Category } from '../types.js';

const router = Router();

// GET all categories
router.get('/', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json(categories);
});

// GET single category by id or slug
router.get('/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const category = db.getCategoryById(idOrSlug) || db.getCategoryBySlug(idOrSlug);
  if (!category) {
    res.status(404).json({ error: 'القسم غير موجود' });
    return;
  }
  res.json(category);
});

// POST add category (Admin only)
router.post('/', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, slug, description, image, displayOrder } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: 'اسم القسم مطلوب' });
    return;
  }

  const generatedSlug = slug?.trim() || name.trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)+/g, '') || `cat-${Date.now()}`;

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    slug: generatedSlug,
    description: description?.trim() || '',
    image: image?.trim() || '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : db.getCategories().length + 1,
  };

  db.addCategory(newCat);

  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: req.user!.id,
    adminName: req.user!.name,
    action: 'إضافة قسم جديد',
    details: `قام ${req.user!.name} بإضافة قسم "${newCat.name}".`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newCat);
});

// PUT update category (Admin only)
router.put('/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.getCategoryById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'القسم غير موجود' });
    return;
  }

  const { name, slug, description, image, displayOrder } = req.body;

  const updated = db.updateCategory(existing.id, {
    name: name?.trim() || existing.name,
    slug: slug?.trim() || existing.slug,
    description: description !== undefined ? description.trim() : existing.description,
    image: image?.trim() || existing.image,
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
  });

  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: req.user!.id,
    adminName: req.user!.name,
    action: 'تعديل قسم',
    details: `قام ${req.user!.name} بتحديث بيانات القسم "${existing.name}".`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  res.json(updated);
});

// DELETE category (Admin only)
router.delete('/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.getCategoryById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'القسم غير موجود' });
    return;
  }

  // Check if any product belongs to this category
  const products = db.getProducts({ categoryId: existing.id });
  if (products.length > 0) {
    res.status(400).json({ error: `لا يمكن حذف هذا القسم لأنه يحتوي على ${products.length} منتج مسجل. يرجى نقل المنتجات أولاً.` });
    return;
  }

  db.deleteCategory(existing.id);

  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: req.user!.id,
    adminName: req.user!.name,
    action: 'حذف قسم',
    details: `قام ${req.user!.name} بحذف القسم "${existing.name}".`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  res.json({ message: 'تم حذف القسم بنجاح' });
});

export default router;
