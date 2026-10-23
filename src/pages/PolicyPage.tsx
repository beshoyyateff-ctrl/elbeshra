import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, RotateCcw } from 'lucide-react';
import { api } from '../services/api.js';
import { StoreSettings } from '../types.js';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'return';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.settings
      .get()
      .then((data) => setSettings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getPolicyContent = () => {
    if (!settings) return { title: '', content: '', icon: null };
    if (type === 'privacy') {
      return {
        title: 'سياسة الخصوصية وأمان البيانات',
        content: settings.privacyPolicy,
        icon: <ShieldCheck className="w-6 h-6 text-[#e0a96d]" />,
      };
    }
    if (type === 'terms') {
      return {
        title: 'الشروط والأحكام العامة',
        content: settings.termsAndConditions,
        icon: <FileText className="w-6 h-6 text-[#e0a96d]" />,
      };
    }
    return {
      title: 'سياسة الاستبدال والاسترجاع والمعاينة',
      content: settings.returnPolicy,
      icon: <RotateCcw className="w-6 h-6 text-[#e0a96d]" />,
    };
  };

  const { title, content, icon } = getPolicyContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <div className="p-2.5 rounded-2xl bg-[#e0a96d]/10 text-[#e0a96d]">
            {icon}
          </div>
          <div>
            <span className="text-xs text-[#e0a96d] font-semibold uppercase tracking-wider">
              روكا مول - مستلزمات جهاز العروسة
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {title}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            جاري تحميل السياسة المعتمدة...
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
            {content}
          </div>
        )}

        <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>آخر تحديث معتمد من إدارة روكا مول: {new Date().getFullYear()}</span>
          <a
            href="https://wa.me/201289778354"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline"
          >
            لأي استفسار بخصوص السياسات تواصل معنا على واتساب 01289778354
          </a>
        </div>
      </div>
    </div>
  );
};
