import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../auth.js';

const router = Router();

// GET all customers (Admin only)
router.get('/', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { search } = req.query;
  let customers = db.getUsers().filter(u => u.role === 'customer');

  if (search) {
    const q = (search as string).toLowerCase().trim();
    customers = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  }

  // Sanitize: never expose passwordHash or salt
  const sanitized = customers.map(c => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    city: c.city || 'سوهاج',
    address: c.address || '',
    notes: c.notes || '',
    createdAt: c.createdAt,
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(sanitized);
});

// GET single customer
router.get('/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const customer = db.getUserById(req.params.id);
  if (!customer || customer.role !== 'customer') {
    res.status(404).json({ error: 'العميل غير موجود' });
    return;
  }

  res.json({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    city: customer.city,
    address: customer.address,
    notes: customer.notes,
    createdAt: customer.createdAt,
  });
});

export default router;
