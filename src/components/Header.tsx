import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  Phone,
  ListChecks,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';
import { AdminPasswordModal } from './AdminPasswordModal.js';

interface HeaderProps {
  onOpenChecklist?: () => void;
  onSearchSubmit?: (query: string) => void;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChecklist, onSearchSubmit, onNavigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const { totalCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const goTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      goTo('/admin');
    } else {
      setAdminModalOpen(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery.trim());
      } else {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      }
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e14]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Subtle Announcement Bar */}
      <div className="bg-[#121622] border-b border-slate-800/50 py-1.5 px-4 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span className="text-[#e0a96d] font-medium">روكا مول</span>
            <span aria-hidden="true">·</span>
            <span>سوهاج، مركز جهينة، أمام قسم شرطة جهينة</span>
          </div>
          <div className="mx-auto sm:mr-auto sm:mx-0 flex items-center gap-3">
            <span className="text-emerald-400 font-medium">الدفع نقداً عند الاستلام والمعاينة</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <a
              href="https://wa.me/201289778354"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="font-mono text-[11px]" dir="ltr">01289778354</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation: 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white hover:text-[#e0a96d] transition-colors shrink-0"
        >
          <span className="text-white">روكا </span>
          <span className="text-[#e0a96d]">مول</span>
        </a>

        {/* Zone 2: Clean unboxed text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="/" className="hover:text-[#e0a96d] transition-colors">
            الرئيسية
          </a>
          <a href="/category/homewear" className="hover:text-[#e0a96d] transition-colors">
            ملابس بيتي
          </a>
          <a href="/category/home-furnishings" className="hover:text-[#e0a96d] transition-colors">
            مفروشات
          </a>
          <a href="/category/electrical-appliances" className="hover:text-[#e0a96d] transition-colors">
            أجهزة ومطبخ
          </a>
          {onOpenChecklist && (
            <button
              onClick={onOpenChecklist}
              className="inline-flex items-center gap-1.5 text-[#e0a96d] hover:text-[#f3d3b0] transition-colors cursor-pointer"
            >
              <ListChecks className="w-4 h-4" />
              <span>قائمة جهاز العروسة</span>
            </button>
          )}
          <a href="/delivery-and-payment" className="hover:text-[#e0a96d] transition-colors">
            التوصيل والدفع
          </a>
          <a href="/about" className="hover:text-[#e0a96d] transition-colors">
            عن المتجر
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="بحث في المنتجات"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart / Trousseau list button */}
          <button
            onClick={openCart}
            aria-label="قائمة مشتريات جهاز العروسة"
            className="relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#1a202c] hover:bg-[#242c3d] border border-slate-700/60 rounded-xl transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#e0a96d]" />
            <span className="hidden sm:inline">الجهاز</span>
            {totalCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold text-[#0c0e14] bg-[#e0a96d] rounded-full">
                {totalCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Button - Placed directly next to Login */}
          <button
            onClick={handleAdminClick}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/40 rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            title="لوحة تحكم المتجر (إضافة وإزالة المنتجات)"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>لوحة التحكم</span>
          </button>

          {/* User Account / Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo('/profile')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-[#e0a96d]" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                title="تسجيل الخروج"
                className="p-2 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
              >
                خروج
              </button>
            </div>
          ) : (
            <button
              onClick={() => goTo('/login')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-[#141824] hover:bg-[#1d2334] border border-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-[#e0a96d]" />
              <span>تسجيل الدخول</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-slate-800 bg-[#0f131c] px-4 py-3">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي عن: روب عروسة، طقم حلل جرانيت، لحاف، لانجري..."
                className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-colors cursor-pointer"
            >
              بحث
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              إلغاء
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e111a] border-t border-slate-800 px-4 py-5 space-y-3">
          <nav className="flex flex-col space-y-3 text-sm">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              الرئيسية
            </a>
            <a
              href="/category/homewear"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              ملابس بيتي
            </a>
            <a
              href="/category/outwear"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              ملابس خروج
            </a>
            <a
              href="/category/lingerie"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              لانجري
            </a>
            <a
              href="/category/electrical-appliances"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              أجهزة كهربائية
            </a>
            <a
              href="/category/kitchenware"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              أدوات منزلية ومطبخ
            </a>
            <a
              href="/category/home-furnishings"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              مفروشات منزلية
            </a>
            {onOpenChecklist && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChecklist();
                }}
                className="flex items-center gap-2 px-3 py-2 text-[#e0a96d] hover:bg-slate-800/60 rounded-lg text-right"
              >
                <ListChecks className="w-4 h-4" />
                <span>قائمة وحاسبة جهاز العروسة</span>
              </button>
            )}
            <a
              href="/delivery-and-payment"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              التوصيل والدفع في سوهاج
            </a>
            {/* Mobile Admin Link */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleAdminClick();
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-600/40 font-bold text-right cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>لوحة التحكم (كلمة السر)</span>
            </button>
            <a
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-200"
            >
              عن روكا مول وموقع المتجر
            </a>
          </nav>
        </div>
      )}

      {/* Admin Password Modal Prompt */}
      <AdminPasswordModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccess={() => goTo('/admin')}
      />
    </header>
  );
};
