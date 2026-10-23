import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './server/routes/authRoutes.js';
import productRoutes from './server/routes/productRoutes.js';
import categoryRoutes from './server/routes/categoryRoutes.js';
import customerRoutes from './server/routes/customerRoutes.js';
import notificationRoutes from './server/routes/notificationRoutes.js';
import settingsRoutes from './server/routes/settingsRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import uploadRoutes from './server/routes/uploadRoutes.js';
import { db } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure public/uploads directory exists and serve it
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// SEO: robots.txt
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${APP_URL}/sitemap.xml
`);
});

// SEO: sitemap.xml
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  res.type('application/xml');
  const products = db.getProducts();
  const categories = db.getCategories();

  const staticUrls = [
    '',
    '/about',
    '/delivery-and-payment',
    '/privacy-policy',
    '/terms',
    '/return-policy',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls
    .map(
      (path) => `
  <url>
    <loc>${APP_URL}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === '' ? '1.0' : '0.7'}</priority>
  </url>`
    )
    .join('')}
  ${categories
    .map(
      (cat) => `
  <url>
    <loc>${APP_URL}/category/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${products
    .map(
      (prod) => `
  <url>
    <loc>${APP_URL}/product/${prod.id}</loc>
    <lastmod>${prod.updatedAt.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  res.send(sitemap);
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', store: 'روكا مول', timestamp: new Date().toISOString() });
});

// Vite middleware for development or static serving for production
async function setupViteOrStatic() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 روكا مول - مستلزمات جهاز العروسة`);
    console.log(`🚀 الخادم يعمل بنجاح على: http://0.0.0.0:${PORT}`);
    console.log(`📍 العنوان: سوهاج، مركز جهينة، أمام قسم شرطة جهينة`);
    console.log(`💬 رقم واتساب الطلبات: 01289778354`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
