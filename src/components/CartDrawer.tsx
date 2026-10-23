import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, totalPrice, sendWhatsAppBatchOrder } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  if (!isOpen) return null;

  const handleCheckout = () => {
    sendWhatsAppBatchOrder(customerName, customerPhone, address);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#10141d] border-r border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#e0a96d]/10 text-[#e0a96d]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">قائمة جهاز العروسة</h3>
                <p className="text-xs text-slate-400">
                  {items.length} {items.length === 1 ? 'قطعة مختارة' : 'قطع مختارة'}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-slate-300 mb-1">قائمة جهازك فارغة</h4>
                <p className="text-xs text-slate-500 max-w-xs mb-4">
                  تصفحي أقسام روكا مول (ملابس بيتي، لانجري، مفروشات، أجهزة ومطبخ) وأضيفي ما يعجبكِ للجهاز.
                </p>
                <button
                  onClick={closeCart}
                  className="px-4 py-2 text-xs font-semibold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-colors cursor-pointer"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-[#161b26] p-3 rounded-xl border border-slate-800/80"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                        title="حذف من القائمة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] text-[#e0a96d] mt-0.5">
                      {item.product.categoryName || 'جهاز العروسة'}
                    </span>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-1 bg-[#10141d] rounded-lg p-0.5 border border-slate-700/60">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold tabular-nums text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#f3d3b0] tabular-nums">
                        {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout via WhatsApp */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0c0f16] space-y-4">
              {/* Optional Quick info for WhatsApp message */}
              <div className="space-y-2 bg-[#141822] p-3 rounded-xl border border-slate-800/80 text-xs">
                <span className="font-semibold text-slate-300 block mb-1">
                  بيانات التوصيل (لتضمينها برسالة واتساب):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="الاسم"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1b202c] border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1b202c] border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="العنوان (مثال: جهينة - سوهاج)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#1b202c] border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500"
                />
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">إجمالي قيمة القائمة:</span>
                <span className="text-lg font-bold text-[#e0a96d] tabular-nums">
                  {totalPrice.toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>الدفع نقداً عند الاستلام والمعاينة لجميع مراكز سوهاج</span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCheckout}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-[#0c0e14] bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>إرسال طلب القائمة عبر واتساب (01289778354)</span>
              </button>

              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>سيتم فتح المحادثة على واتساب فورا</span>
                <button
                  onClick={clearCart}
                  className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  إفراغ القائمة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
