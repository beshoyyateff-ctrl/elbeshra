import React, { useState } from 'react';
import { User, Lock, Phone, MapPin, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api, setStoredToken } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onNavigateLogin }) => {
  const { updateUserContext, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('سوهاج - مركز جهينة');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('يرجى كتابة الاسم بالكامل');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setError('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.register({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        password,
        address: address.trim(),
        city: city.trim(),
      });

      setStoredToken(res.token);
      updateUserContext(res.user);
      await refreshUser();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
        <div className="text-center space-y-2">
          <a href="/" className="inline-block text-2xl font-extrabold text-white">
            روكا <span className="text-[#e0a96d]">مول</span>
          </a>
          <h1 className="text-xl font-bold text-slate-100">إنشاء حساب عميل جديد</h1>
          <p className="text-xs text-slate-400">
            سجلي بياناتكِ لتسهيل طلب مستلزمات جهاز العروسة وحفظ عنوان التوصيل في سوهاج
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-300">الاسم بالكامل:</label>
            <div className="relative">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم العروسة أو المشتري"
                className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300">رقم الهاتف أو الواتساب:</label>
              <div className="relative">
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012XXXXXXXX"
                  className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300">البريد الإلكتروني (اختياري):</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300">المدينة / المركز:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="جهينة، طهطا، المراغة، سوهاج..."
                className="w-full px-3.5 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300">العنوان التفصيلي للتوصيل:</label>
              <div className="relative">
                <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الشارع، علامة مميزة بجوار..."
                  className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300">كلمة المرور:</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6 خانات على الأقل"
                  className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300">تأكيد كلمة المرور:</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعيدي إدخال الكلمة"
                  className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-sm font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>جاري تسجيل الحساب...</span>
            ) : (
              <>
                <span>إنشاء الحساب والمتابعة</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          لديكِ حساب بالفعل؟{' '}
          <button
            onClick={onNavigateLogin}
            className="text-[#e0a96d] hover:underline font-bold cursor-pointer"
          >
            تسجيل الدخول هنا
          </button>
        </div>
      </div>
    </div>
  );
};
