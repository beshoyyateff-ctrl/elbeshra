import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090b10] border-t border-slate-800/80 text-slate-400 text-sm">
      {/* Bridal Trust Pillars Bar */}
      <div className="border-b border-slate-800/60 bg-[#0e1118] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800/60 text-[#e0a96d] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">متجرنا في جهينة</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                سوهاج، مركز جهينة، أمام قسم شرطة جهينة مباشرة مع إمكانية الزيارة والمعاينة على الطبيعة.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800/60 text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">طلب مباشر عبر واتساب</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                اختاري ما يناسبكِ واضغطي على زر واتساب لتأكيد الطلب الفوري على 01289778354.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800/60 text-[#e0a96d] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">معاينة قبل الدفع</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                الدفع نقداً عند الاستلام مع حق فتح الشحنة وفحص جهازكِ والتأكد من المقاسات والألوان.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800/60 text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">ضمان مستلزمات العروسة</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                أجهزة أصلية بضمان معتمد وخامات قطنية ومفروشات تركية ومصرية تدوم وتشرّف في جهازك.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <a href="/" className="inline-block text-2xl font-extrabold text-white">
              روكا <span className="text-[#e0a96d]">مول</span>
            </a>
            <p className="text-xs leading-relaxed text-slate-400">
              المتجر المتخصص في مستلزمات جهاز العروسة بمحافظة سوهاج ومراكز الصعيد. نوفر كل ما تحتاجه العروسة من ملابس بيتي وخروج، لانجري، أجهزة كهربائية، أدوات مطبخ ومفروشات سرير ملكية بأفضل الأسعار.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-[#e0a96d] shrink-0" />
                <span>سوهاج، مركز جهينة، أمام قسم شرطة جهينة</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-[#e0a96d] shrink-0" />
                <span>يومياً من 10:00 صباحاً حتى 11:00 مساءً</span>
              </div>
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider mb-4 border-b border-slate-800 pb-2">
              أقسام جهاز العروسة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/category/homewear" className="hover:text-[#e0a96d] transition-colors">
                  ملابس بيتي وأرواب عرايس
                </a>
              </li>
              <li>
                <a href="/category/outwear" className="hover:text-[#e0a96d] transition-colors">
                  ملابس خروج واستقبال
                </a>
              </li>
              <li>
                <a href="/category/lingerie" className="hover:text-[#e0a96d] transition-colors">
                  لانجري وأطقم ليلة الزفاف
                </a>
              </li>
              <li>
                <a href="/category/electrical-appliances" className="hover:text-[#e0a96d] transition-colors">
                  أجهزة كهربائية بالضمان
                </a>
              </li>
              <li>
                <a href="/category/kitchenware" className="hover:text-[#e0a96d] transition-colors">
                  أدوات منزلية ومطبخ العروسة
                </a>
              </li>
              <li>
                <a href="/category/home-furnishings" className="hover:text-[#e0a96d] transition-colors">
                  مفروشات وملايات قطن مصري
                </a>
              </li>
            </ul>
          </div>

          {/* Quick & Support Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider mb-4 border-b border-slate-800 pb-2">
              خدمة العملاء والسياسات
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/delivery-and-payment" className="hover:text-[#e0a96d] transition-colors">
                  معلومات التوصيل والدفع نقداً
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#e0a96d] transition-colors">
                  عن روكا مول وموقع المعرض
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-[#e0a96d] transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-[#e0a96d] transition-colors">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="/return-policy" className="hover:text-[#e0a96d] transition-colors">
                  سياسة الاسترجاع والاستبدال
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-[#e0a96d] transition-colors">
                  حساب العميل
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider mb-4 border-b border-slate-800 pb-2">
              طلب مباشر واستفسارات
            </h4>
            <p className="text-xs text-slate-400">
              يمكنكِ التواصل المباشر مع إدارة المتجر لطلب أي منتج أو الاستفسار عن كولكشن العرائس الجديد:
            </p>
            <a
              href="https://wa.me/201289778354"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold text-[#0c0e14] bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>واتساب: 01289778354</span>
            </a>
            <div className="text-[11px] text-slate-500 text-center">
              الأسعار بالجنيه المصري (EGP) · الدفع نقداً عند الاستلام
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} روكا مول - مستلزمات جهاز العروسة (سوهاج - جهينة).
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin/login" className="text-slate-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>دخول الإدارة</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
