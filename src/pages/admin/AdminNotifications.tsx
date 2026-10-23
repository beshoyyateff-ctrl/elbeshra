import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, MessageCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { Notification } from '../../types.js';
import { api } from '../../services/api.js';

interface AdminNotificationsProps {
  onRefreshBadge: () => void;
}

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({ onRefreshBadge }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.notifications.getAll();
      setNotifications(res.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.notifications.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      onRefreshBadge();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onRefreshBadge();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>إشعارات تسجيل العملاء والطلبات</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إشعارات فورية تظهر هنا داخل لوحة التحكم عند قيام أي عميل جديد بإنشاء حساب
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 text-xs font-semibold text-slate-200 bg-[#171c2b] hover:bg-[#20273c] border border-slate-700/80 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>تحديد الكل كمقروء</span>
        </button>
      </div>

      {/* External Notification Provider Documentation Box */}
      <div className="bg-[#121820] border border-amber-600/30 rounded-3xl p-5 sm:p-6 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Info className="w-4 h-4 text-amber-400" />
          <span>ملاحظة حول الإشعارات الخارجية (الرسائل النصية والبريد الإلكتروني):</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          نظام الإشعارات الحالي يعمل محلياً داخل لوحة التحكم بكفاءة كاملة فور تسجيل أي عميل. لتفعيل إرسال إشعارات خارجية عبر رسائل SMS للهاتف أو البريد الإلكتروني (SMTP) أو WhatsApp Business API، قم بتهيئة بيانات الاعتماد المقابلة في ملف <code className="text-[#e0a96d] font-mono">.env</code> كما هو موضح في دليل الإعداد بالملف المرفق <code className="text-[#e0a96d] font-mono">.env.example</code>.
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">جاري تحميل الإشعارات...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500">
            لا توجد إشعارات مسجلة حتى الآن
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
                n.isRead
                  ? 'bg-[#121622] border-slate-800/80 opacity-80'
                  : 'bg-[#151c2a] border-amber-500/40 shadow-lg shadow-black/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                  <span className="font-bold text-slate-100 text-sm">{n.title}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(n.createdAt).toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    - {new Date(n.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{n.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 mr-auto sm:mr-0">
                {n.data?.customerPhone && (
                  <a
                    href={`https://wa.me/20${n.data.customerPhone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/40 text-[11px] font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>مراسلة واتساب</span>
                  </a>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    تحديد كمقروء
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
