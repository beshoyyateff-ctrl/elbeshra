import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { quickAdminLogin } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('يرجى إدخال كلمه السر يا مستر');
      return;
    }

    try {
      setLoading(true);
      await quickAdminLogin(password.trim());
      setPassword('');
      onClose();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'كلمة السر غير صحيحة، حاول مجدداً يا مستر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121622] border border-amber-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 text-right space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">الدخول إلى لوحة التحكم</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            مخصص لإدارة المتجر لإضافة وحذف وتعديل كافة منتجات جهاز العروسة والأقسام والأسعار
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {/* The exact requested text above the password field */}
            <label className="block text-sm font-bold text-amber-300 tracking-wide">
              كلمه السر يا مستر
            </label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="اكتب كلمة السر هنا..."
                className="w-full pr-10 pl-11 py-3 bg-[#171d2b] border border-slate-700/90 focus:border-amber-400 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
                title={showPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              كلمة السر المعتمدة تمنحك صلاحيات المدير العام الكاملة لإضافة وحذف المنتجات وتعديل الأسعار.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-[#0c0e14] bg-gradient-to-r from-amber-400 to-[#e0a96d] hover:from-amber-300 hover:to-[#f3d3b0] rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>جاري التحقق والدخول...</span>
            ) : (
              <>
                <span>دخول لوحة التحكم</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
