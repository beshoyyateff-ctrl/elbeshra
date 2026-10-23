import React from 'react';
import {
  Package,
  Layers,
  Users,
  Bell,
  Plus,
  MessageCircle,
  Clock,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AuditLog } from '../../types.js';

interface AdminOverviewProps {
  metrics: {
    totalProducts: number;
    totalCategories: number;
    totalCustomers: number;
    unreadNotifications: number;
  };
  recentCustomers: Array<{ id: string; name: string; phone: string; city: string; createdAt: string }>;
  recentLogs: AuditLog[];
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  metrics,
  recentCustomers,
  recentLogs,
  onNavigateTab,
  onOpenAddProduct,
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#171d2b] to-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-right">
          <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">
            نظام إدارة روكا مول
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            مرحباً بك في لوحة تحكم مستلزمات جهاز العروسة
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            يمكنك من هنا متابعة منتجات المعرض في جهينة بسوهاج، مراجعة تسجيلات العملاء الجدد، وتحديث الأسعار والأقسام.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2.5 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </button>
          <button
            onClick={() => onNavigateTab('notifications')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-[#141824] hover:bg-[#1a2130] border border-slate-700/80 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>مراجعة الإشعارات ({metrics.unreadNotifications})</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#121622] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 space-y-3 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">المنتجات المعروضة</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {metrics.totalProducts}
            </span>
            <span className="text-[11px] text-[#e0a96d]">إدارة المنتجات ←</span>
          </div>
        </div>

        {/* Categories */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-[#121622] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 space-y-3 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">أقسام المتجر</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {metrics.totalCategories}
            </span>
            <span className="text-[11px] text-purple-300">أقسام جهاز العروسة ←</span>
          </div>
        </div>

        {/* Customers */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-[#121622] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 space-y-3 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">العملاء المسجلون</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {metrics.totalCustomers}
            </span>
            <span className="text-[11px] text-emerald-300">سجل العملاء ←</span>
          </div>
        </div>

        {/* Unread Alerts */}
        <div
          onClick={() => onNavigateTab('notifications')}
          className="bg-[#121622] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 space-y-3 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">إشعارات غير مقروءة</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {metrics.unreadNotifications}
            </span>
            <span className="text-[11px] text-rose-300">عرض الإشعارات ←</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Registrations & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Customer Registrations (7 cols) */}
        <div className="lg:col-span-7 bg-[#121622] border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#e0a96d]" />
              <span>أحدث تسجيلات العملاء في المتجر</span>
            </h2>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-xs text-[#e0a96d] hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-2">
            {recentCustomers.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">لا توجد تسجيلات حديثة حتى الآن</p>
            ) : (
              recentCustomers.map((cust) => (
                <div
                  key={cust.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#161a26] border border-slate-800/80 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-100 block">{cust.name}</span>
                    <span className="text-[11px] text-slate-400">
                      {cust.city} · مسجل بتاريخ {new Date(cust.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/20${cust.phone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>مراسلة واتساب</span>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Log Activity Feed (5 cols) */}
        <div className="lg:col-span-5 bg-[#121622] border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>سجل النشاط الإداري</span>
            </h2>
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="text-xs text-[#e0a96d] hover:underline"
            >
              السجل الكامل
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {recentLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-[#161b27] border border-slate-800/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{log.action}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{log.details}</p>
                <div className="text-[10px] text-[#e0a96d]">بواسطة: {log.adminName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
