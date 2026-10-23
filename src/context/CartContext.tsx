import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types.js';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalCount: number;
  totalPrice: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  sendWhatsAppBatchOrder: (customerName?: string, customerPhone?: string, address?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'roka_mall_bridal_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  const sendWhatsAppBatchOrder = (customerName?: string, customerPhone?: string, address?: string) => {
    if (items.length === 0) return;

    let msg = `🌸 *طلب جديد من متجر روكا مول - جهاز العروسة* 🌸\n`;
    msg += `مرحباً، أود تأكيد طلب قائمة مستلزمات جهاز العروسة التالية:\n\n`;

    items.forEach((item, index) => {
      msg += `${index + 1}. *${item.product.name}*\n`;
      msg += `   - كود المنتج: #${item.product.id}\n`;
      msg += `   - الكمية: ${item.quantity}\n`;
      msg += `   - السعر: ${item.product.price} ج.م (الإجمالي: ${item.product.price * item.quantity} ج.م)\n`;
      msg += `   - الرابط: ${window.location.origin}/product/${item.product.id}\n\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *إجمالي قيمة الطلب:* ${totalPrice.toLocaleString('ar-EG')} ج.م\n`;
    msg += `🚚 *طريقة الدفع:* نقداً عند الاستلام والمعاينة\n`;

    if (customerName) msg += `👤 *اسم العميلة/العميل:* ${customerName}\n`;
    if (customerPhone) msg += `📞 *رقم الهاتف:* ${customerPhone}\n`;
    if (address) msg += `📍 *عنوان التوصيل:* ${address}\n`;

    msg += `\nيرجى تأكيد توافر المنتجات وموعد التوصيل، شكراً لكم!`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/201289778354?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalCount,
        totalPrice,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        sendWhatsAppBatchOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
