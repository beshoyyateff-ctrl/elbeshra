import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  Bell,
  Settings,
  ShieldAlert,
  ClipboardList,
  LogOut,
  Store,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  unreadCount,
  children,
}) => {
  const { user, isManager, logout } = useAuth();

  const navItems = [
    { id: 'overview', label: 'لوحة المعلومات', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'إدارة المنتجات', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'أقسام المتجر', icon: <Layers className="w-4 h-4" /> },
    { id: 'customers', label: 'سجل العملاء', icon: <Users className="w-4 h-4" /> },
    {
      id: 'notifications',
      label: 'الإشعارات',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: 'settings', label: 'إعدادات المتجر والسياسات', icon: <Settings className="w-4 h-4" /> },
    // Only Manager (Bishara Ayoub) can access user management
    ...(isManager
      ? [{ id: 'users', label: 'المستخدمون والصلاحيات', icon: <ShieldAlert className="w-4 h-4" /> }]
      : []),
    { id: 'audit-logs', label: 'سجل العمليات والرقابة', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0e111a] border-b md:border-b-0 md:border-l border-slate-800 flex flex-col shrink-0">
        {/* Brand Lockup */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-white">
              روكا <span className="text-[#e0a96d]">مول</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#e0a96d]/15 text-[#e0a96d] font-bold">
              لوحة الإدارة
            </span>
          </a>
          <a
            href="/"
            title="العودة للمتجر"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1"
          >
            <Store className="w-4 h-4" />
          </a>
        </div>

        {/* Current Admin User Info */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-[#141824] border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e0a96d]/20 text-[#e0a96d] flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || 'أ'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">
                {user?.name}
              </span>
              <span className="text-[11px] text-amber-300 font-semibold block">
                {user?.role === 'manager' ? 'المدير العام (صلاحيات كاملة)' : 'مساعد إدارة'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === item.id
                  ? 'bg-[#e0a96d] text-[#0c0e14] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                    currentTab === item.id
                      ? 'bg-[#0c0e14] text-[#e0a96d]'
                      : 'bg-rose-500 text-white animate-pulse'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer border border-rose-900/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج من الإدارة</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-[#0e111a]/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>لوحة التحكم</span>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#e0a96d] font-semibold">
              {navItems.find((i) => i.id === currentTab)?.label || 'الرئيسية'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              روكا مول · سوهاج، مركز جهينة (أمام قسم شرطة جهينة)
            </span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1a2030] text-slate-200 border border-slate-700/80 inline-flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-[#e0a96d]" />
              <span>معاينة واجهة المتجر</span>
            </a>
          </div>
        </header>

        {/* Body View */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
