import React from 'react';
import { Truck, ShieldCheck, Banknote, MessageCircle, MapPin, CheckCircle2, Clock } from 'lucide-react';

export const DeliveryPaymentPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">
          التوصيل والدفع في روكا مول
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          معلومات الشحن، المعاينة، والدفع عند الاستلام
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          نحرص على أن تصلكِ مستلزمات جهازكِ بأعلى درجات الأمان، مع حق المعاينة الكاملة قبل سداد أي مبلغ.
        </p>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#131724] border border-slate-800 rounded-3xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mx-auto">
            <Banknote className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-100">الدفع نقداً عند الاستلام</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            لا نطلب أي بطاقات ائتمانية أو دفع مسبق. الدفع يتم نقداً للمندوب بعد استلام طلبكِ.
          </p>
        </div>

        <div className="bg-[#131724] border border-slate-800 rounded-3xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e0a96d]/10 text-[#e0a96d] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-100">حق المعاينة والتأكد</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            لكِ كامل الحق في فتح الطرد والتأكد من جودة الخامات والمقاسات والألوان ومطابقتها للمطلوب قبل دفع القيمة.
          </p>
        </div>

        <div className="bg-[#131724] border border-slate-800 rounded-3xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-400/10 text-sky-400 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-100">توصيل منزلي سريع</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            خدمة شحن وتوصيل منزلي مباشر لجميع مراكز وقرى محافظة سوهاج وصعيد مصر.
          </p>
        </div>
      </div>

      {/* Delivery Coverage in Sohag */}
      <div className="bg-[#11151f] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-[#e0a96d]" />
          <div>
            <h2 className="text-lg font-bold text-white">نطاق التوصيل ومواعيد الشحن</h2>
            <p className="text-xs text-slate-400">مركز جهينة ومحافظة سوهاج</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-[#161a26] border border-slate-800 space-y-2">
            <span className="font-bold text-[#e0a96d] text-sm block">1. مركز جهينة والقرى المجاورة:</span>
            <p className="text-slate-400 leading-relaxed">
              توصيل سريع خلال 24 ساعة فقط، مع إمكانية استلام الطلبات مباشرة من مقر المتجر أمام قسم شرطة جهينة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#161a26] border border-slate-800 space-y-2">
            <span className="font-bold text-[#e0a96d] text-sm block">2. باقي مراكز سوهاج ومحافظات الصعيد:</span>
            <p className="text-slate-400 leading-relaxed">
              توصيل خلال 48 إلى 72 ساعة لـ (طهطا، المراغة، سوهاج العاصمة، أخميم، البلينا، جرجا، المنشأة، دار السلام) وباقي محافظات الصعيد.
            </p>
          </div>
        </div>
      </div>

      {/* Step by step WhatsApp Order */}
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <span>خطوات الطلب عبر واتساب 01289778354</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-[#e0a96d] flex items-center justify-center font-bold shrink-0 mt-0.5">
              1
            </div>
            <div>
              <strong className="text-slate-200 block mb-0.5">اختيار المنتجات المطلوبة لجهازكِ:</strong>
              <p className="text-slate-400 leading-relaxed">
                تصفحي أقسام المتجر (ملابس بيتي، لانجري، مفروشات، أدوات مطبخ، أجهزة كهربائية) واضغطي على زر "اطلب عبر واتساب" في أي منتج.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-[#e0a96d] flex items-center justify-center font-bold shrink-0 mt-0.5">
              2
            </div>
            <div>
              <strong className="text-slate-200 block mb-0.5">إرسال الرسالة لتأكيد التوافر:</strong>
              <p className="text-slate-400 leading-relaxed">
                سيتم فتح تطبيق واتساب مباشرة برسالة جاهزة تتضمن كود المنتج وسعره ورابطه. أرسلي الرسالة وسيقوم ممثل خدمة العملاء بتأكيد المقاسات والألوان وتحديد ميعاد التوصيل.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-[#e0a96d] flex items-center justify-center font-bold shrink-0 mt-0.5">
              3
            </div>
            <div>
              <strong className="text-slate-200 block mb-0.5">المعاينة ثم الدفع نقداً:</strong>
              <p className="text-slate-400 leading-relaxed">
                عند وصول مندوب التوصيل، يحق لكِ فحص المنتج بدقة قبل سداد المبلغ. في حال لم يكن مطابقاً للمواصفات، يمكنكِ رفض الاستلام دون أي التزام.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            لديكِ أي سؤال إضافي حول التوصيل؟
          </span>
          <a
            href="https://wa.me/201289778354"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-xs font-bold text-[#0c0e14] bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>تواصلي مع قسم الشحن عبر واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
};
