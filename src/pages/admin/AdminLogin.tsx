import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigateSetup: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onSuccess,
  onNavigateSetup,
  onBackToStore,
}) => {
  const { adminLogin } = useAuth();
  const [identifier, setIdentifier] = useState('بشاره ايوب');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requiresSetup, setRequiresSetup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRequiresSetup(false);

    if (!password) {
      setError('يرجى إدخال كلمه السر يا مستر');
      return;
    }

    try {
      setLoading(true);
      await adminLogin(identifier.trim() || 'بشاره ايوب', password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'بيانات الدخول الإدارية غير صحيحة');
      if (err.message && err.message.includes('التهيئة الأولى')) {
        setRequiresSetup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">تسجيل الدخول الإداري</h1>
          <p className="text-xs text-slate-400">
            مخصص للمدير (بشاره ايوب) ومساعد الإدارة (توماس ايوب)
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{error}</span>
              {requiresSetup && (
                <button
                  type="button"
                  onClick={onNavigateSetup}
                  className="block text-amber-300 underline font-bold mt-1"
                >
                  الانتقال إلى شاشة إعداد المدير الأولى
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick select between Bishara and Thomas */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#171d2b] rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setIdentifier('بشاره ايوب')}
            className={`py-2 px-3 rounded-lg font-semibold transition-colors cursor-pointer ${
              identifier === 'بشاره ايوب'
                ? 'bg-[#e0a96d] text-[#0c0e14]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            المدير: بشاره ايوب
          </button>
          <button
            type="button"
            onClick={() => setIdentifier('توماس ايوب')}
            className={`py-2 px-3 rounded-lg font-semibold transition-colors cursor-pointer ${
              identifier === 'توماس ايوب'
                ? 'bg-sky-400 text-[#0c0e14]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            المساعد: توماس ايوب
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5 text-right">
            <label className="text-slate-300 font-semibold">اسم المستخدم أو البريد:</label>
            <div className="relative">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-amber-300 font-bold block text-sm">كلمه السر يا مستر:</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="اكتب كلمة السر هنا..."
                className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>جاري التحقق...</span>
            ) : (
              <>
                <span>الدخول للوحة التحكم</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center space-y-3 text-xs">
          <div>
            <button
              onClick={onNavigateSetup}
              className="text-amber-400 hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>التهيئة الأولى لحساب المدير العام</span>
            </button>
          </div>

          <div>
            <button
              onClick={onBackToStore}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← العودة لمتجر روكا مول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
