export type UserRole = 'manager' | 'assistant' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
  salt: string;
  address?: string;
  city?: string;
  notes?: string;
  isPasswordSet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  price: number;
  oldPrice?: number;
  image: string;
  additionalImages?: string[];
  description: string;
  features?: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  badge?: string; // e.g. "جهاز العروسة" | "الأكثر طلباً" | "جديد"
  trousseauTip?: string; // bridal advice for this product
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'new_customer' | 'order_inquiry' | 'product_alert';
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  ip?: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  governorate: string;
  landmark: string;
  workingHours: string;
  shippingInfo: string;
  deliveryNotice: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerImage: string;
  privacyPolicy: string;
  termsAndConditions: string;
  returnPolicy: string;
}

export interface DatabaseSchema {
  users: User[];
  categories: Category[];
  products: Product[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  settings: StoreSettings;
}
