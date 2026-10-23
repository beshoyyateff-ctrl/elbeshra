import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Lock, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';

interface ProfilePageProps {
  onOpenChecklist: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenChecklist }) => {
  const { user, updateUserContext, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'سوهاج');
  const [address, setAddress] = useState(user?.address || '');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center text-slate-300">
        <p>يرجى تسجيل الدخول لعرض الملف الشخصي.</p>
        <a href="/login" className="mt-4 inline-block px-4 py-2 bg-[#e0a96d] text-slate-900 font-bold rounded-xl">
          تسجيل الدخول
        </a>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg(null);
    try {
      const res = await api.auth.updateProfile({ name, phone, city, address });
      updateUserContext(res.user);
      setProfileMsg({ text: 'تم تحديث بياناتكِ بنجاح', isError: false });
    } catch (err: any) {
      setProfileMsg({ text: err.message || 'فشل التحديث', isError: true });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ text: 'كلمة المرور الجديدة يجب أن تكون 6 خانات على الأقل', isError: true });
      return;
    }
    try {
      await api.auth.changePassword({ oldPassword, newPassword });
      setPasswordMsg({ text: 'تم تغيير كلمة المرور بنجاح', isError: false });
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message || 'فشل تغيير كلمة المرور', isError: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Card */}
      <div className="bg-[#141824] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-right">
          <div className="w-16 h-16 rounded-2xl bg-[#e0a96d]/10 text-[#e0a96d] flex items-center justify-center text-2xl font-bold shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              عميلة روكا مول · مسجلة بتاريخ {new Date(user.createdAt).toLocaleDateString('ar-EG')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChecklist}
            className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-[#1b2130] hover:bg-[#242c40] border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            قائمة جهاز العروسة
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 border border-rose-800/40 rounded-xl transition-colors cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal & Delivery Information */}
        <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#e0a96d]" />
            <span>بيانات الاتصال وعنوان التوصيل</span>
          </h2>

          {profileMsg && (
            <div
              className={`p-3 rounded-xl text-xs ${
                profileMsg.isError
                  ? 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
                  : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">الاسم بالكامل:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">رقم الهاتف:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">المدينة / المركز:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">العنوان التفصيلي للتسليم:</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 px-4 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </form>
        </div>

        {/* Change Password & WhatsApp Help */}
        <div className="space-y-8">
          {/* Password update */}
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#e0a96d]" />
              <span>الأمان وتغيير كلمة المرور</span>
            </h2>

            {passwordMsg && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  passwordMsg.isError
                    ? 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
                    : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300">كلمة المرور الحالية:</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">كلمة المرور الجديدة:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-100 bg-[#1b2130] hover:bg-[#252d42] border border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                تحديث كلمة المرور
              </button>
            </form>
          </div>

          {/* Direct WhatsApp Concierge for the Bride */}
          <div className="bg-[#101918] border border-emerald-900/50 rounded-3xl p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>خدمة عملاء جهاز العروسة المباشرة</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              تحتاجين مساعدة في تنسيق ألوان أطقم الملايات، أو الاستفسار عن كولكشن اللانجري، أو تفاصيل ضمان الأجهزة الكهربائية؟
            </p>
            <a
              href="https://wa.me/201289778354"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-[#0c0e14] bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all"
            >
              <span>تواصل مباشر مع المتجر (01289778354)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
