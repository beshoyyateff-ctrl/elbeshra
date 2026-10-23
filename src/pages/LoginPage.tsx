import React, { useState } from 'react';
import { User, Lock, Phone, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateRegister: () => void;
  onNavigateAdminLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateAdminLogin,
}) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError('يرجى إدخال رقم الهاتف أو البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setLoading(true);
      await login(identifier.trim(), password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التأكد من البيانات المدخلة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <a href="/" className="inline-block text-2xl font-extrabold text-white">
            روكا <span className="text-[#e0a96d]">مول</span>
          </a>
          <h1 className="text-xl font-bold text-slate-100">تسجيل دخول العميل</h1>
          <p className="text-xs text-slate-400">
            مرحباً بكِ مجدداً في متجر مستلزمات جهاز العروسة
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-300">
              رقم الهاتف أو البريد الإلكتروني:
            </label>
            <div className="relative">
              <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="012XXXXXXXX أو البريد"
                className="w-full pr-10 pl-4 py-3 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-300">
              كلمة المرور:
            </label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-3 bg-[#171d2b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-sm font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>جاري التحقق...</span>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Links */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-3 text-xs">
          <div className="text-slate-400">
            ليس لديكِ حساب بعد؟{' '}
            <button
              onClick={onNavigateRegister}
              className="text-[#e0a96d] hover:underline font-bold cursor-pointer"
            >
              إنشاء حساب عميل جديد
            </button>
          </div>

          <div>
            <button
              onClick={onNavigateAdminLogin}
              className="text-slate-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>دخول إدارة المتجر (بشاره ايوب / توماس ايوب)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
