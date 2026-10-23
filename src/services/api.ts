import {
  User,
  Category,
  Product,
  Notification,
  AuditLog,
  StoreSettings,
} from '../types.js';

const TOKEN_KEY = 'roka_mall_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data?.error || `حدث خطأ في الاتصال بالخادم (${res.status})`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    getSetupStatus: () => request<{ isManagerConfigured: boolean; managerName: string; assistantName: string }>('/api/auth/setup-status'),
    setupAdmin: (data: { managerPassword: string; assistantPassword?: string; setupToken?: string }) =>
      request<{ message: string; token: string; user: User }>('/api/auth/setup-admin', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    adminLogin: (identifier: string, password: string) =>
      request<{ token: string; user: User }>('/api/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      }),
    quickAdminLogin: (password: string) =>
      request<{ message: string; token: string; user: User }>('/api/auth/quick-admin-login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      }),
    register: (userData: { name: string; phone: string; email?: string; password: string; address?: string; city?: string }) =>
      request<{ message: string; token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    login: (identifier: string, password: string) =>
      request<{ message: string; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      }),
    getMe: () => request<User>('/api/auth/me'),
    updateProfile: (data: { name?: string; phone?: string; address?: string; city?: string }) =>
      request<{ message: string; user: User }>('/api/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    changePassword: (data: { oldPassword?: string; newPassword: string }) =>
      request<{ message: string }>('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Products
  products: {
    getAll: (params?: { categoryId?: string; search?: string; featured?: boolean }) => {
      const q = new URLSearchParams();
      if (params?.categoryId) q.set('categoryId', params.categoryId);
      if (params?.search) q.set('search', params.search);
      if (params?.featured !== undefined) q.set('featured', String(params.featured));
      return request<Product[]>(`/api/products${q.toString() ? `?${q.toString()}` : ''}`);
    },
    getById: (id: string) => request<Product>(`/api/products/${id}`),
    create: (productData: Partial<Product>) =>
      request<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),
    update: (id: string, productData: Partial<Product>) =>
      request<Product>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/products/${id}`, {
        method: 'DELETE',
      }),
  },

  // Categories
  categories: {
    getAll: () => request<Category[]>('/api/categories'),
    getById: (idOrSlug: string) => request<Category>(`/api/categories/${idOrSlug}`),
    create: (data: Partial<Category>) =>
      request<Category>('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Category>) =>
      request<Category>(`/api/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  // Customers (Admin)
  customers: {
    getAll: (search?: string) => {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      return request<User[]>(`/api/customers${q}`);
    },
    getById: (id: string) => request<User>(`/api/customers/${id}`),
  },

  // Notifications (Admin)
  notifications: {
    getAll: () => request<{ unreadCount: number; notifications: Notification[] }>('/api/notifications'),
    markRead: (id: string) =>
      request<{ message: string }>(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      }),
    markAllRead: () =>
      request<{ message: string }>('/api/notifications/mark-all-read', {
        method: 'POST',
      }),
  },

  // Settings
  settings: {
    get: () => request<StoreSettings>('/api/settings'),
    update: (data: Partial<StoreSettings>) =>
      request<{ message: string; settings: StoreSettings }>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Admin Management
  admin: {
    getOverview: () =>
      request<{
        metrics: {
          totalProducts: number;
          totalCategories: number;
          totalCustomers: number;
          unreadNotifications: number;
          activeAdmins: number;
        };
        recentCustomers: Array<{ id: string; name: string; phone: string; city: string; createdAt: string }>;
        recentLogs: AuditLog[];
      }>('/api/admin/overview'),
    getUsers: () => request<Array<User & { isPasswordSet: boolean }>>('/api/admin/users'),
    updateUserPassword: (id: string, newPassword: string) =>
      request<{ message: string }>(`/api/admin/users/${id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword }),
      }),
    getAuditLogs: () => request<AuditLog[]>('/api/admin/audit-logs'),
  },

  // File Upload
  upload: {
    uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
      const token = getStoredToken();
      const formData = new FormData();
      formData.append('image', file);

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'فشل رفع الصورة');
      }
      return data;
    },
  },
};
