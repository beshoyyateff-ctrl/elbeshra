import React from 'react';
import { ArrowLeft, Sparkles, MessageCircle, ShieldCheck, Truck, CheckCircle2, ListChecks } from 'lucide-react';
import { Category, Product } from '../types.js';
import { ProductCard } from '../components/ProductCard.js';

interface HomePageProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (slug: string) => void;
  onViewProduct: (productId: string) => void;
  onOpenChecklist: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  products,
  onSelectCategory,
  onViewProduct,
  onOpenChecklist,
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#131722] via-[#0f121a] to-[#0c0e14] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e0a96d]/10 border border-[#e0a96d]/30 text-[#e0a96d] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المتجر الأول لمستلزمات جهاز العروسة في سوهاج وجهينة</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.25]">
                كل تفصيلة في <span className="text-[#e0a96d]">جهازكِ الملكي</span>..
                <br />
                بأعلى جودة وأرقى ذوق
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                في <strong className="text-white">روكا مول</strong> جمعنا لكِ تشكيلة متكاملة من ملابس البيتي والخروج، اللانجري، المفروشات التركية والمصرية، والأجهزة الكهربائية وأدوات المطبخ الأصلية مع إمكانية المعاينة قبل الاستلام والدفع كاش عند باب بيتك.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#categories-section"
                  className="px-6 py-3.5 text-sm font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-lg shadow-[#e0a96d]/10 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>تصفحي أقسام جهاز العروسة</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>

                <button
                  onClick={onOpenChecklist}
                  className="px-5 py-3.5 text-sm font-semibold text-slate-200 bg-[#191f2c] hover:bg-[#222a3b] border border-slate-700/80 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <ListChecks className="w-4 h-4 text-[#e0a96d]" />
                  <span>قائمة وحاسبة جهاز العروسة</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>معاينة وتأكد قبل الدفع</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>توصيل لكافة قرى ومراكز سوهاج</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>طلب مباشر عبر واتساب 01289778354</span>
                </div>
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/80 aspect-[4/3] group">
                <img
                  src="/src/assets/images/hero_bridal_trousseau_1791212765901.jpg"
                  alt="معرض روكا مول لمستلزمات جهاز العروسة"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider mb-1">
                    المعرض الرئيسي
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1">
                    روكا مول - جهينة، سوهاج
                  </h3>
                  <p className="text-xs text-slate-300">
                    أمام قسم شرطة جهينة مباشرة · تشكيلة الموسم الجديد متوفرة الآن
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid (Section 1) */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">
              أقسام المتجر
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              مستلزمات جهاز العروسة حسب القسم
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              اختر القسم للاطلاع على كافة المنتجات والأسعار المحدثة بالجنيه المصري
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group relative flex flex-col bg-[#141824] border border-slate-800 rounded-2xl overflow-hidden hover:border-[#e0a96d]/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-md"
              >
                <div className="aspect-[4/3] w-full bg-[#1b212f] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-[#e0a96d] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {count} {count === 1 ? 'منتج' : 'منتجات'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Bridal Products (Section 2) */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">
                اختيارات العرائس
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                الأكثر طلباً لجهاز العروسة
              </h2>
            </div>
            <a
              href="#categories-section"
              className="text-xs font-semibold text-[#e0a96d] hover:text-[#f3d3b0] transition-colors"
            >
              عرض كافة الأقسام ←
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* How WhatsApp Ordering Works (Section 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              بساطة وأمان
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
              كيف تطلبين جهازكِ عبر واتساب في 3 خطوات؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
              لا داعي للدفع بالفيزا أو إدخال بطاقات بنكية، الطلب معنا يتم بضغطة زر واحدة والتأكيد المباشر مع فريق المعرض:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2 bg-[#171c2b] p-4 rounded-2xl border border-slate-700/50">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/10 text-emerald-400 font-bold text-sm flex items-center justify-center">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-100">اختاري المنتج واضغطي الزر</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  اضغطي على "اطلب عبر واتساب" في صفحة المنتج، وسيتم فتح محادثة واتساب مع رقمنا الرسمي 01289778354.
                </p>
              </div>

              <div className="space-y-2 bg-[#171c2b] p-4 rounded-2xl border border-slate-700/50">
                <div className="w-8 h-8 rounded-xl bg-[#e0a96d]/10 text-[#e0a96d] font-bold text-sm flex items-center justify-center">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-100">إرسال الرسالة الجاهزة</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تكون الرسالة مجهزة تلقائياً باسم المنتج وكوده وسعره بالجنيه المصري. أرسليها لفريق المتجر لتأكيد المقاس واللون.
                </p>
              </div>

              <div className="space-y-2 bg-[#171c2b] p-4 rounded-2xl border border-slate-700/50">
                <div className="w-8 h-8 rounded-xl bg-sky-400/10 text-sky-400 font-bold text-sm flex items-center justify-center">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-100">المعاينة والدفع كاش عند الاستلام</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  يصلكِ الطلب حتى باب المنزل في سوهاج أو جهينة، وتقومين بفتح الشحنة ومعاينتها بالكامل قبل دفع أي مبلغ.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>رقم الواتساب المعتمد للمتجر:</span>
                <span className="font-mono text-emerald-400 font-bold" dir="ltr">01289778354</span>
              </div>
              <a
                href="https://wa.me/201289778354"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-xs font-bold text-[#0c0e14] bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>تحدثي معنا الآن على واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added Products (Section 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">
              جديد روكا مول
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              أحدث ما وصل لمستلزمات جهاز العروسة
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
