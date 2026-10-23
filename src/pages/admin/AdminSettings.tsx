import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { StoreSettings } from '../../types.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

export const AdminSettings: React.FC = () => {
  const { isManager } = useAuth();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Form fields
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');

  useEffect(() => {
    api.settings
      .get()
      .then((data) => {
        setSettings(data);
        setStoreName(data.storeName);
        setTagline(data.tagline);
        setPhone(data.phone);
        setWhatsappNumber(data.whatsappNumber);
        setAddress(data.address);
        setWorkingHours(data.workingHours);
        setHeroTitle(data.heroTitle);
        setHeroSubtitle(data.heroSubtitle);
        setPrivacyPolicy(data.privacyPolicy);
        setTermsAndConditions(data.termsAndConditions);
        setReturnPolicy(data.returnPolicy);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload: Partial<StoreSettings> = {
      storeName,
      tagline,
      phone,
      whatsappNumber,
      address,
      workingHours,
      heroTitle,
      heroSubtitle,
    };

    if (isManager) {
      payload.privacyPolicy = privacyPolicy;
      payload.termsAndConditions = termsAndConditions;
      payload.returnPolicy = returnPolicy;
    }

    try {
      const res = await api.settings.update(payload);
      setSettings(res.settings);
      setFeedback({ text: 'تم حفظ إعدادات المتجر والسياسات بنجاح', isError: false });
    } catch (err: any) {
      setFeedback({ text: err.message || 'فشل حفظ الإعدادات', isError: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#e0a96d]" />
          <span>إعدادات المتجر والسياسات</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          تعديل معلومات روكا مول، أرقام التواصل عبر واتساب، وعناوين المعرض والسياسات المعتمدة
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Store Info */}
        <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            المعلومات الأساسية للمتجر والمعرض
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">اسم المتجر:</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">الشعار اللفظي (التاجلاين):</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">رقم واتساب الطلبات:</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">رقم هاتف الاتصال المباشر:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">عنوان المعرض الكامل:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">مواعيد العمل:</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Hero Banner Text */}
        <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            نصوص البانر الترويجي بالصفحة الرئيسية
          </h2>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">عنوان الهيرو الرئيسي:</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">النص التعريفي الفرعي:</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 leading-relaxed"
            />
          </div>
        </div>

        {/* Policies Texts (Editable by Manager) */}
        <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">
                سياسات المتجر والشروط القانونية
              </h2>
              <p className="text-[11px] text-slate-400">
                النصوص التي تظهر لعملاء المتجر في صفحات السياسات وتذييل الموقع
              </p>
            </div>
            {!isManager && (
              <span className="px-3 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[11px] flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>مقتصر على المدير العام (بشاره ايوب)</span>
              </span>
            )}
          </div>

          {/* Privacy */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">سياسة الخصوصية:</label>
            <textarea
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              disabled={!isManager}
              rows={4}
              className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 disabled:opacity-50 leading-relaxed"
            />
          </div>

          {/* Terms */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">الشروط والأحكام:</label>
            <textarea
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              disabled={!isManager}
              rows={4}
              className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 disabled:opacity-50 leading-relaxed"
            />
          </div>

          {/* Return */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">سياسة الاسترجاع والاستبدال:</label>
            <textarea
              value={returnPolicy}
              onChange={(e) => setReturnPolicy(e.target.value)}
              disabled={!isManager}
              rows={4}
              className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 disabled:opacity-50 leading-relaxed"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ كافة الإعدادات والسياسات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
