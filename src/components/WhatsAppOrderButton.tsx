import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Product } from '../types.js';

interface WhatsAppOrderButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  variant?: 'primary' | 'compact' | 'outline';
}

export const WhatsAppOrderButton: React.FC<WhatsAppOrderButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  variant = 'primary',
}) => {
  const storePhone = '201289778354';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${product.id}`;
    const totalAmount = product.price * quantity;

    let message = `🌸 *طلب شراء جديد من متجر روكا مول* 🌸\n\n`;
    message += `أود طلب المنتج التالي لجهاز العروسة:\n`;
    message += `📌 *المنتج:* ${product.name}\n`;
    message += `🔢 *كود المنتج:* #${product.id}\n`;
    message += `💰 *السعر:* ${product.price.toLocaleString('ar-EG')} ج.م\n`;
    if (quantity > 1) {
      message += `📦 *الكمية:* ${quantity}\n`;
      message += `💵 *الإجمالي:* ${totalAmount.toLocaleString('ar-EG')} ج.م\n`;
    }
    message += `🔗 *رابط المنتج:* ${productUrl}\n\n`;
    message += `🚚 *طريقة الدفع:* نقداً عند الاستلام والمعاينة (سوهاج/جهينة)\n`;
    message += `يرجى إفادتي بتوافر المنتج وتأكيد تفاصيل التوصيل.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${storePhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        title="اطلب عبر واتساب (01289778354)"
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm cursor-pointer ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>واتساب</span>
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-400 border border-emerald-500/40 hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer ${className}`}
      >
        <MessageCircle className="w-4 h-4 text-emerald-400" />
        <span>اطلب عبر واتساب</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <button
        onClick={handleClick}
        className={`w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm font-bold text-[#0c0e14] bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 active:scale-[0.99] cursor-pointer ${className}`}
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span>اطلب عبر واتساب (01289778354)</span>
      </button>
      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        سيفتح تطبيق واتساب برسالة جاهزة تحتوي كود وسعر المنتج. يرجى إرسال الرسالة لتأكيد طلبكِ مع فريق روكا مول. الدفع نقداً عند المعاينة والاستلام.
      </p>
    </div>
  );
};
