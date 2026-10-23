/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';
import { TrousseauChecklistModal } from './components/TrousseauChecklistModal.js';
import { HomePage } from './pages/HomePage.js';
import { CategoryPage } from './pages/CategoryPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { SearchPage } from './pages/SearchPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { DeliveryPaymentPage } from './pages/DeliveryPaymentPage.js';
import { AboutContactPage } from './pages/AboutContactPage.js';
import { PolicyPage } from './pages/PolicyPage.js';
import { AdminLogin } from './pages/admin/AdminLogin.js';
import { AdminSetup } from './pages/admin/AdminSetup.js';
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { AdminOverview } from './pages/admin/AdminOverview.js';
import { AdminProducts } from './pages/admin/AdminProducts.js';
import { AdminCategories } from './pages/admin/AdminCategories.js';
import { AdminCustomers } from './pages/admin/AdminCustomers.js';
import { AdminNotifications } from './pages/admin/AdminNotifications.js';
import { AdminSettings } from './pages/admin/AdminSettings.js';
import { AdminUsers } from './pages/admin/AdminUsers.js';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs.js';
import { Category, Product, AuditLog } from './types.js';
import { api } from './services/api.js';

function MainApp() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();

  // Navigation state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [adminTab, setAdminTab] = useState('overview');
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // App data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminMetrics, setAdminMetrics] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalCustomers: 0,
    unreadNotifications: 0,
  });
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadStoreData = async () => {
    try {
      setDataLoading(true);
      const [cats, prods] = await Promise.all([
        api.categories.getAll(),
        api.products.getAll(),
      ]);
      setCategories(cats);
      setProducts(prods);

      if (isAdmin) {
        await loadAdminData();
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [overviewData, notifsData] = await Promise.all([
        api.admin.getOverview(),
        api.notifications.getAll(),
      ]);
      setAdminMetrics(overviewData.metrics);
      setRecentCustomers(overviewData.recentCustomers);
      setRecentLogs(overviewData.recentLogs);
      setUnreadCount(notifsData.unreadCount);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, [isAdmin]);

  // Route matching helpers
  const isCategoryRoute = currentPath.startsWith('/category/');
  const categorySlug = isCategoryRoute ? currentPath.replace('/category/', '') : null;

  const isProductRoute = currentPath.startsWith('/product/');
  const productId = isProductRoute ? currentPath.replace('/product/', '') : null;

  const isSearchRoute = currentPath.startsWith('/search');
  const searchQuery = new URLSearchParams(window.location.search).get('q') || '';

  // Determine current category or product
  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug || c.id === categorySlug)
    : undefined;

  const activeProduct = productId
    ? products.find((p) => p.id === productId || p.slug === productId)
    : undefined;

  // Render Admin View
  if (currentPath === '/admin/setup') {
    return (
      <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col justify-center">
        <AdminSetup
          onSuccess={() => navigate('/admin')}
          onNavigateLogin={() => navigate('/admin/login')}
        />
      </div>
    );
  }

  if (currentPath === '/admin/login') {
    return (
      <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col justify-center">
        <AdminLogin
          onSuccess={() => navigate('/admin')}
          onNavigateSetup={() => navigate('/admin/setup')}
          onBackToStore={() => navigate('/')}
        />
      </div>
    );
  }

  if (currentPath.startsWith('/admin')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#090b10] flex items-center justify-center text-xs text-slate-400">
          جاري التحقق من الصلاحيات الإدارية...
        </div>
      );
    }

    if (!user || (!isAdmin)) {
      return (
        <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col justify-center">
          <AdminLogin
            onSuccess={() => navigate('/admin')}
            onNavigateSetup={() => navigate('/admin/setup')}
            onBackToStore={() => navigate('/')}
          />
        </div>
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={setAdminTab}
        unreadCount={unreadCount}
      >
        {adminTab === 'overview' && (
          <AdminOverview
            metrics={adminMetrics}
            recentCustomers={recentCustomers}
            recentLogs={recentLogs}
            onNavigateTab={setAdminTab}
            onOpenAddProduct={() => {
              setAdminTab('products');
              setIsAddProductModalOpen(true);
            }}
          />
        )}
        {adminTab === 'products' && (
          <AdminProducts
            products={products}
            categories={categories}
            onRefresh={loadStoreData}
            isAddModalOpen={isAddProductModalOpen}
            onCloseAddModal={() => setIsAddProductModalOpen(false)}
          />
        )}
        {adminTab === 'categories' && (
          <AdminCategories
            categories={categories}
            products={products}
            onRefresh={loadStoreData}
          />
        )}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'notifications' && (
          <AdminNotifications onRefreshBadge={loadAdminData} />
        )}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'users' && <AdminUsers />}
        {adminTab === 'audit-logs' && <AdminAuditLogs />}
      </AdminLayout>
    );
  }

  // Customer Facing Routes
  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-100 flex flex-col selection:bg-[#e0a96d]/20 selection:text-[#f3d3b0]">
      {/* Top Bar Header */}
      <Header
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onSearchSubmit={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
        onNavigate={navigate}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPath === '/login' && (
          <LoginPage
            onSuccess={() => navigate('/profile')}
            onNavigateRegister={() => navigate('/register')}
            onNavigateAdminLogin={() => navigate('/admin/login')}
          />
        )}

        {currentPath === '/register' && (
          <RegisterPage
            onSuccess={() => navigate('/profile')}
            onNavigateLogin={() => navigate('/login')}
          />
        )}

        {currentPath === '/profile' && (
          <ProfilePage onOpenChecklist={() => setIsChecklistOpen(true)} />
        )}

        {currentPath === '/delivery-and-payment' && <DeliveryPaymentPage />}

        {currentPath === '/about' && <AboutContactPage />}

        {currentPath === '/privacy-policy' && <PolicyPage type="privacy" />}

        {currentPath === '/terms' && <PolicyPage type="terms" />}

        {currentPath === '/return-policy' && <PolicyPage type="return" />}

        {isSearchRoute && (
          <SearchPage
            initialQuery={searchQuery}
            categories={categories}
            products={products}
            onViewProduct={(id) => navigate(`/product/${id}`)}
            onSelectCategory={(slug) => navigate(`/category/${slug}`)}
          />
        )}

        {isCategoryRoute && activeCategory && (
          <CategoryPage
            category={activeCategory}
            allCategories={categories}
            products={products}
            onSelectCategory={(slug) => navigate(`/category/${slug}`)}
            onViewProduct={(id) => navigate(`/product/${id}`)}
            onBackToHome={() => navigate('/')}
          />
        )}

        {isProductRoute && activeProduct && (
          <ProductDetailPage
            product={activeProduct}
            category={categories.find((c) => c.id === activeProduct.categoryId)}
            relatedProducts={products
              .filter(
                (p) => p.categoryId === activeProduct.categoryId && p.id !== activeProduct.id
              )
              .slice(0, 4)}
            onBack={() => navigate('/')}
            onSelectCategory={(slug) => navigate(`/category/${slug}`)}
            onViewProduct={(id) => navigate(`/product/${id}`)}
          />
        )}

        {currentPath === '/' && (
          <HomePage
            categories={categories}
            products={products}
            onSelectCategory={(slug) => navigate(`/category/${slug}`)}
            onViewProduct={(id) => navigate(`/product/${id}`)}
            onOpenChecklist={() => setIsChecklistOpen(true)}
          />
        )}
      </main>

      {/* Cart / Trousseau Drawer */}
      <CartDrawer />

      {/* Interactive Trousseau Checklist Planner */}
      <TrousseauChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        onSelectCategory={(slug) => {
          setIsChecklistOpen(false);
          navigate(`/category/${slug}`);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
