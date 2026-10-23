import React, { useState } from 'react';
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
  Check,
  Heart,
  Plus,
  Minus,
  MessageCircle,
} from 'lucide-react';
import { Product, Category } from '../types.js';
import { WhatsAppOrderButton } from '../components/WhatsAppOrderButton.js';
import { ProductCard } from '../components/ProductCard.js';
import { useCart } from '../context/CartContext.js';

interface ProductDetailPageProps {
  product: Product;
  category?: Category;
  relatedProducts: Product[];
  onBack: () => void;
  onSelectCategory: (slug: string) => void;
  onViewProduct: (productId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  category,
  relatedProducts,
  onBack,
  onSelectCategory,
  onViewProduct,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const { addItem } = useCart();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={onBack} className="hover:text-white transition-colors cursor-pointer">
          الرئيسية
        </button>
        <span aria-hidden="true">/</span>
        {category && (
          <>
            <button
              onClick={() => onSelectCategory(category.slug)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {category.name}
            </button>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-[#e0a96d] font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Contiguous Purchase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Visual Gallery (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#161a25] border border-slate-800 shadow-xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <div className="absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold text-[#0c0e14] bg-[#e0a96d] rounded-lg shadow-md">
                {product.badge}
              </div>
            )}
          </div>

          {/* Trust Highlights under image */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#121620] border border-slate-800 rounded-2xl text-center text-xs text-slate-300">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">توصيل منزلي</span>
              <span className="text-[10px] text-slate-400">سوهاج وكافة مراكزها</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-slate-800 px-2">
              <ShieldCheck className="w-4 h-4 text-[#e0a96d]" />
              <span className="font-semibold text-slate-200">معاينة وفحص</span>
              <span className="text-[10px] text-slate-400">تأكدي قبل الدفع</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-slate-200">استبدال 14 يوم</span>
              <span className="text-[10px] text-slate-400">حسب شروط المتجر</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6 text-right">
          {/* Category & Code */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {category && (
                <button
                  onClick={() => onSelectCategory(category.slug)}
                  className="text-[#e0a96d] hover:underline font-semibold"
                >
                  {category.name}
                </button>
              )}
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-400">كود المنتج: #{product.id}</span>
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161a25] hover:bg-[#1e2333] border border-slate-800 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة الرابط</span>
                </>
              )}
            </button>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
            {product.name}
          </h1>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 p-4 bg-[#141824] rounded-2xl border border-slate-800/80">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#f3d3b0] tabular-nums tracking-tight">
                {product.price.toLocaleString('ar-EG')}
              </span>
              <span className="text-sm font-semibold text-slate-300">جنيه مصري (EGP)</span>
            </div>

            {product.oldPrice && product.oldPrice > product.price && (
              <div className="mr-auto text-xs text-slate-500 flex items-center gap-1.5">
                <span className="line-through tabular-nums">
                  {product.oldPrice.toLocaleString('ar-EG')} ج.م
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40 font-semibold">
                  وفرتي {(product.oldPrice - product.price).toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            )}
          </div>

          {/* Quantity Stepper and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-300">الكمية المطلوبة:</span>
              <div className="flex items-center gap-2 bg-[#161b27] border border-slate-700/80 rounded-xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="إنقاص الكمية"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="زيادة الكمية"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary WhatsApp Order CTA */}
            <div className="pt-2">
              <WhatsAppOrderButton
                product={product}
                quantity={quantity}
              />
            </div>

            {/* Secondary Action: Add to Trousseau List */}
            <button
              onClick={handleAddToCart}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-slate-200 bg-[#161c28] hover:bg-[#202738] border border-slate-700/80 rounded-xl transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#e0a96d]" />
              <span>أضيفي لقائمة جهازكِ (طلب مجمّع)</span>
            </button>
          </div>

          {/* Bridal Advice Box */}
          {product.trousseauTip && (
            <div className="p-4 rounded-2xl bg-[#171b1e] border border-amber-600/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#e0a96d] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 mb-0.5 font-bold">
                  نصيحة روكا مول لجهازكِ:
                </strong>
                {product.trousseauTip}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-200">تفاصيل ومواصفات المنتج:</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Feature Highlights */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300">أبرز المميزات:</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products in Same Category */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              مستلزمات أخرى قد تعجبكِ في نفس القسم
            </h2>
            {category && (
              <button
                onClick={() => onSelectCategory(category.slug)}
                className="text-xs font-semibold text-[#e0a96d] hover:text-[#f3d3b0]"
              >
                تصفح كل منتجات {category.name} ←
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
