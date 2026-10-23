import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { User } from '../../types.js';

export const AdminUsers: React.FC = () => {
  const [admins, setAdmins] = useState<Array<User & { isPasswordSet: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getUsers();
      setAdmins(data);
    } catch (err: any) {
      setFeedback({ text: err.message || 'فشل جلب المستخدمين الإداريين', isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    setSaving(true);
    setFeedback(null);

    if (newPassword.length < 6) {
      setFeedback({ text: 'كلمة المرور يجب أن لا تقل عن 6 خانات', isError: true });
      setSaving(false);
      return;
    }

    try {
      const res = await api.admin.updateUserPassword(selectedAdmin.id, newPassword);
      setFeedback({ text: res.message, isError: false });
      setSelectedAdmin(null);
      setNewPassword('');
      await fetchAdmins();
    } catch (err: any) {
      setFeedback({ text: err.message || 'فشل تغيير كلمة المرور', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>المستخدمون الإداريون والصلاحيات (خاص بالمدير بشاره ايوب)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          إدارة حسابات الإدارة المعتمدة، إعادة تعيين كلمات المرور، والتحكم في صلاحيات النظام
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            feedback.isError
              ? 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
              : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
          }`}
        >
          {feedback.isError ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Role explanation */}
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-slate-200">هيكل الصلاحيات المعتمد للمتجر:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#161a26] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-[#e0a96d] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>المدير: بشاره ايوب (صلاحيات كاملة)</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              إدارة كافة صلاحيات ومستخدمي لوحة التحكم، إعدادات المتجر الرئيسية، السياسات والشروط القانونية، المنتجات والأقسام، سجل العملاء، وسجل الرقابة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#161a26] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <UserCheck className="w-4 h-4" />
              <span>المساعد: توماس ايوب (صلاحيات تشغيلية)</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              إضافة وتعديل المنتجات والأقسام، مراجعة سجل العملاء والإشعارات. لا يمكنه تعديل كلمة مرور المدير أو تغيير السياسات القانونية أو إعدادات الأمان.
            </p>
          </div>
        </div>
      </div>

      {/* Admins Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {admins.map((adm) => (
          <div
            key={adm.id}
            className="bg-[#121622] border border-slate-800 rounded-3xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-base font-bold text-white block">{adm.name}</span>
                <span className="text-xs text-slate-400 font-mono block">{adm.email}</span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    adm.role === 'manager'
                      ? 'bg-[#e0a96d]/15 text-[#e0a96d]'
                      : 'bg-sky-500/15 text-sky-300'
                  }`}
                >
                  {adm.role === 'manager' ? 'المدير العام' : 'مساعد إدارة المتجر'}
                </span>
              </div>

              <div
                className={`w-3 h-3 rounded-full mt-1 ${
                  adm.isPasswordSet ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                }`}
                title={adm.isPasswordSet ? 'كلمة المرور معينة ومفعلة' : 'في انتظار التهيئة'}
              />
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>رقم الهاتف: <span className="text-slate-300 font-mono" dir="ltr">{adm.phone}</span></div>
              <div>حالة الحساب: <span className="text-slate-300">{adm.isPasswordSet ? 'نشط ومحمى' : 'يحتاج تعيين كلمة المرور'}</span></div>
            </div>

            <button
              onClick={() => {
                setSelectedAdmin(adm);
                setNewPassword('');
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-[#171d2b] hover:bg-[#20273c] border border-slate-700/80 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>إعادة تعيين كلمة المرور</span>
            </button>
          </div>
        ))}
      </div>

      {/* Password Reset Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-white">
              تعيين كلمة مرور جديدة لـ ({selectedAdmin.name})
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              سيتم تشفير كلمة المرور الجديدة وتحديثها في قاعدة البيانات فوراً.
            </p>

            <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">كلمة المرور الجديدة:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6 خانات على الأقل"
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAdmin(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl cursor-pointer"
                >
                  {saving ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
