import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Eye, ImageOff } from 'lucide-react';
import { Product } from '../types.js';
import { WhatsAppOrderButton } from './WhatsAppOrderButton.js';
import { useCart } from '../context/CartContext.js';

interface ProductCardProps {
  product: Product;
  onViewProduct?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  const handleCardClick = () => {
    if (onViewProduct) {
      onViewProduct(product.id);
    } else {
      window.location.href = `/product/${product.id}`;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-[#141822] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-[#e0a96d]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer"
    >
      {/* Visual Slot (65%-70% height) */}
      <div className="relative aspect-[4/3] w-full bg-[#1b202e] overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#191e2b] to-[#121620] text-slate-500 p-4 text-center">
            <ImageOff className="w-8 h-8 mb-2 text-slate-600" />
            <span className="text-xs text-slate-400">صورة مستلزمات العروسة</span>
            <span className="text-[11px] text-slate-500 mt-0.5">{product.categoryName}</span>
          </div>
        )}

        {/* Quiet subtle badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-medium text-[#fbe8d3] bg-[#0c0e14]/85 backdrop-blur-md rounded-md border border-[#e0a96d]/30">
            {product.badge}
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/80 rounded-lg border border-rose-800/50">
              غير متوفر حالياً
            </span>
          </div>
        )}
      </div>

      {/* Body Information */}
      <div className="flex flex-col flex-1 p-4">
        {/* Unboxed Metadata with · separator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
          <span className="text-[#e0a96d] font-medium">{product.categoryName || 'مستلزمات العروسة'}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>كود #{product.id.replace('prod-', '')}</span>
          {product.isFeatured && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-300/90 inline-flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> مميز
              </span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-[15px] font-semibold text-slate-100 group-hover:text-[#e0a96d] transition-colors line-clamp-2 leading-snug mb-2">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-slate-800/60">
          <span className="text-lg font-bold text-[#f3d3b0] tabular-nums tracking-tight">
            {product.price.toLocaleString('ar-EG')}
          </span>
          <span className="text-xs font-medium text-slate-400">ج.م</span>

          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs text-slate-500 line-through tabular-nums mr-auto">
              {product.oldPrice.toLocaleString('ar-EG')} ج.م
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-[#1e2535] hover:bg-[#283247] rounded-lg transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#e0a96d]" />
            <span>أضيفي للجهاز</span>
          </button>

          <WhatsAppOrderButton
            product={product}
            variant="compact"
          />
        </div>
      </div>
    </div>
  );
};
