import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Send, CheckCircle2, Building, HeartHandshake } from 'lucide-react';

export const AboutContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Also offer direct WhatsApp fallback
    try {
      // Direct WhatsApp redirect with message
      let fullMsg = `🌸 *استفسار جديد من موقع روكا مول* 🌸\n`;
      fullMsg += `👤 *الاسم:* ${name}\n`;
      fullMsg += `📞 *الهاتف:* ${phone}\n`;
      fullMsg += `📝 *الرسالة:* ${message}\n`;

      const encoded = encodeURIComponent(fullMsg);
      window.open(`https://wa.me/201289778354?text=${encoded}`, '_blank');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">
          عن روكا مول
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          أهلاً بكم في صرح مستلزمات جهاز العروسة
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          نحن في <strong className="text-slate-200">روكا مول</strong> فخورون بخدمة أهالي محافظة سوهاج ومركز جهينة وكافة عرائس الصعيد بأفضل المنتجات وأرقى الخامات.
        </p>
      </div>

      {/* About Story */}
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#e0a96d]/10 text-[#e0a96d]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">قصتنا وهدفنا</h2>
            <p className="text-xs text-slate-400">وجهة العروسة الأولى في سوهاج</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          تأسس <strong>روكا مول</strong> ليكون الوجهة المتكاملة والشاملة لكل عروسة وأسرة في صعيد مصر تبحث عن التميز والراحة أثناء تجهيز بيت الزوجية. ندرك تماماً أهمية كل تفصيلة في جهاز العروسة—من أطقم الملايات القطنية والمفروشات المطرزة، إلى أرواب الستان واللانجري الراقي، مروراً بأطقم الحلل الجرانيت التركية والأجهزة الكهربائية المضمونة.
        </p>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          حرصنا على توفير معرضنا بموقع مميز وحيوي في <strong>قلب مركز جهينة بسوهاج (أمام قسم شرطة جهينة مباشرة)</strong> ليكون قريباً وسهل الوصول لجميع الزوار، مع إتاحة هذا المتجر الإلكتروني لتمكينكم من تصفح كافة المنتجات واختيار ما يعجبكم بطلب سريع ومباشر عبر واتساب.
        </p>
      </div>

      {/* Store Location & Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="bg-[#141824] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
            معلومات الاتصال وزيارة المتجر
          </h3>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-[#e0a96d] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-100 block mb-0.5">موقع المعرض:</strong>
                <p className="text-slate-400 leading-relaxed">
                  محافظة سوهاج، مركز جهينة، أمام قسم شرطة جهينة مباشرة.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-100 block mb-0.5">رقم واتساب الطلبات والاستفسار:</strong>
                <a
                  href="https://wa.me/201289778354"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-emerald-400 font-bold hover:underline"
                  dir="ltr"
                >
                  01289778354
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-sky-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-100 block mb-0.5">الاتصال الهاتفي:</strong>
                <a href="tel:01289778354" className="font-mono text-slate-300 hover:text-white" dir="ltr">
                  01289778354
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-[#e0a96d] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-100 block mb-0.5">ساعات العمل الرسمية:</strong>
                <p className="text-slate-400">
                  يومياً طوال أيام الأسبوع من الساعة 10:00 صباحاً حتى 11:00 مساءً.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/201289778354"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-[#0c0e14] bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>مراسلتنا الآن عبر واتساب</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
            أرسلي لنا استفساركِ أو طلبكِ
          </h3>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-800/60 p-5 rounded-2xl text-center space-y-2 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-emerald-300 text-sm">تم إرسال رسالتكِ بنجاح!</h4>
              <p className="text-slate-300 leading-relaxed">
                تم توجيه استفساركِ عبر واتساب لفريق المتجر وسنقوم بالرد عليكِ في أقرب وقت.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-slate-400 underline hover:text-white cursor-pointer"
              >
                إرسال استفسار آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1 text-right">
                <label className="text-slate-300 font-semibold">الاسم:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمكِ الكريم"
                  className="w-full px-3 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                  required
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-slate-300 font-semibold">رقم الهاتف أو الواتساب:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012XXXXXXXX"
                  className="w-full px-3 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                  required
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-slate-300 font-semibold">نص الاستفسار أو المنتجات المطلوبة:</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="اكتبي تفاصيل استفساركِ عن أسعار جهاز العروسة أو التوصيل في جهينة..."
                  className="w-full px-3 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الاستفسار وتأكيده عبر واتساب</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
