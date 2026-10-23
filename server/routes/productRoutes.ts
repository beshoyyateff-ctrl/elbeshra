import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../auth.js';
import { Product } from '../types.js';

const router = Router();

// GET all products with filtering
router.get('/', (req: Request, res: Response) => {
  const { categoryId, search, featured } = req.query;

  const products = db.getProducts({
    categoryId: categoryId as string,
    search: search as string,
    featured: featured !== undefined ? featured === 'true' : undefined,
  });

  res.json(products);
});

// GET single product
router.get('/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'المنتج غير موجود أو قد تم حذفه' });
    return;
  }
  res.json(product);
});

// POST create product (Admin only)
router.post('/', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, categoryId, price, oldPrice, image, additionalImages, description, features, isAvailable, isFeatured, badge, trousseauTip } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: 'اسم المنتج مطلوب' });
    return;
  }

  if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
    res.status(400).json({ error: 'يرجى إدخال سعر صحيح للمنتج بالجنيه المصري' });
    return;
  }

  const category = db.getCategoryById(categoryId);
  if (!category) {
    res.status(400).json({ error: 'القسم المختار غير صالح' });
    return;
  }

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)+/g, '') || `prod-${Date.now()}`;

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
    categoryId,
    categoryName: category.name,
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : undefined,
    image: image?.trim() || '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    additionalImages: Array.isArray(additionalImages) ? additionalImages : [],
    description: description?.trim() || '',
    features: Array.isArray(features) ? features : [],
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    isFeatured: Boolean(isFeatured),
    badge: badge?.trim() || undefined,
    trousseauTip: trousseauTip?.trim() || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.addProduct(newProduct);

  // Audit log
  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: req.user!.id,
    adminName: req.user!.name,
    action: 'إضافة منتج جديد',
    details: `قام ${req.user!.name} بإضافة منتج "${newProduct.name}" بسعر ${newProduct.price} ج.م في قسم "${category.name}".`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newProduct);
});

// PUT update product (Admin only)
router.put('/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.getProductById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'المنتج غير موجود' });
    return;
  }

  const { name, categoryId, price, oldPrice, image, additionalImages, description, features, isAvailable, isFeatured, badge, trousseauTip } = req.body;

  let categoryName = existing.categoryName;
  if (categoryId && categoryId !== existing.categoryId) {
    const cat = db.getCategoryById(categoryId);
    if (cat) categoryName = cat.name;
  }

  const updated = db.updateProduct(existing.id, {
    name: name?.trim() || existing.name,
    categoryId: categoryId || existing.categoryId,
    categoryName,
    price: price !== undefined ? Number(price) : existing.price,
    oldPrice: oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : undefined) : existing.oldPrice,
    image: image?.trim() || existing.image,
    additionalImages: additionalImages !== undefined ? additionalImages : existing.additionalImages,
    description: description !== undefined ? description.trim() : existing.description,
    features: features !== undefined ? features : existing.features,
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : existing.isAvailable,
    isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
    badge: badge !== undefined ? (badge.trim() || undefined) : existing.badge,
    trousseauTip: trousseauTip !== undefined ? (trousseauTip.trim() || undefined) : existing.trousseauTip,
  });

  // Audit log
  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: req.user!.id,
    adminName: req.user!.name,
    action: 'تعديل منتج',
    details: `قام ${req.user!.name} بتحديث بيانات المنتج "${existing.name}".`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  res.json(updated);
});

// DELETE product (Admin only)
router.delete('/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.getProductById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'المنتج غير موجود' });
    return;
  }

  db.deleteProduct(existing.id);

  // Audit log
  db.addAuditLog({
    id: `log-${Date.now()}`,
    adminId: req.user!.id,
    adminName: req.user!.name,
    action: 'حذف منتج',
    details: `قام ${req.user!.name} بحذف المنتج "${existing.name}" (كود: ${existing.id}).`,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  });

  res.json({ message: 'تم حذف المنتج بنجاح' });
});

export default router;
