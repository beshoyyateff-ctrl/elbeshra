import React, { useState } from 'react';
import { ShieldAlert, Lock, KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { api, setStoredToken } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

interface AdminSetupProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const AdminSetup: React.FC<AdminSetupProps> = ({ onSuccess, onNavigateLogin }) => {
  const { updateUserContext, refreshUser } = useAuth();
  const [managerPassword, setManagerPassword] = useState('');
  const [confirmManagerPassword, setConfirmManagerPassword] = useState('');
  const [assistantPassword, setAssistantPassword] = useState('');
  const [setupToken, setSetupToken] = useState('roka-initial-setup-key-2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (managerPassword.length < 6) {
      setError('كلمة مرور المدير (بشاره ايوب) يجب أن تكون 6 خانات على الأقل');
      return;
    }

    if (managerPassword !== confirmManagerPassword) {
      setError('تأكيد كلمة المرور غير متطابق');
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.setupAdmin({
        managerPassword,
        assistantPassword: assistantPassword.trim() || undefined,
        setupToken: setupToken.trim() || undefined,
      });

      setStoredToken(res.token);
      updateUserContext(res.user);
      await refreshUser();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'فشل إعداد حساب الإدارة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">إعداد وتأمين حسابات الإدارة</h1>
          <p className="text-xs text-slate-400">
            التهيئة الأمنية الأولى لمتجر روكا مول (المدير: بشاره ايوب والمساعد: توماس ايوب)
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Manager Password */}
          <div className="space-y-1 text-right">
            <label className="text-slate-200 font-semibold block">
              كلمة مرور المدير العام (بشاره ايوب):
            </label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={managerPassword}
                onChange={(e) => setManagerPassword(e.target.value)}
                placeholder="6 خانات على الأقل (احفظها جيداً)"
                className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                required
              />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-slate-200 font-semibold block">
              تأكيد كلمة مرور المدير:
            </label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={confirmManagerPassword}
                onChange={(e) => setConfirmManagerPassword(e.target.value)}
                placeholder="أعد كتابة كلمة المرور"
                className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                required
              />
            </div>
          </div>

          {/* Assistant Password */}
          <div className="space-y-1 text-right pt-2 border-t border-slate-800">
            <label className="text-slate-300 block">
              كلمة مرور المساعد (توماس ايوب) - اختياري الآن:
            </label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={assistantPassword}
                onChange={(e) => setAssistantPassword(e.target.value)}
                placeholder="يمكن للمدير تعيينها لاحقاً أيضاً"
                className="w-full pr-10 pl-4 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
              />
            </div>
          </div>

          {/* Setup Token */}
          <div className="space-y-1 text-right pt-2 border-t border-slate-800">
            <label className="text-slate-400 text-[11px] block">
              رمز الأمان لتهيئة الخادم (ADMIN_SETUP_TOKEN):
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={setupToken}
                onChange={(e) => setSetupToken(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 font-mono text-[11px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <span>جاري التشفير والتأمين...</span>
            ) : (
              <>
                <span>تفعيل حساب المدير والدخول</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          تم الإعداد مسبقاً؟{' '}
          <button onClick={onNavigateLogin} className="text-[#e0a96d] hover:underline font-bold">
            تسجيل الدخول هنا
          </button>
        </div>
      </div>
    </div>
  );
};
