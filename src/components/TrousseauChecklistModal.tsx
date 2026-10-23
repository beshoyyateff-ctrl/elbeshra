import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, Sparkles, ShoppingBag } from 'lucide-react';

interface TrousseauChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (slug: string) => void;
}

interface ChecklistItem {
  id: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  suggestedQty: string;
  priority: 'أساسي' | 'مهم' | 'تكميلي';
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // Homewear
  { id: 'c1', name: 'روب عروسة ستان ملكي للصباحية (3 قطع)', categorySlug: 'homewear', categoryName: 'ملابس بيتي', suggestedQty: '1 - 2 طقم', priority: 'أساسي' },
  { id: 'c2', name: 'بيجامات قطن تركي استقبال فاخرة', categorySlug: 'homewear', categoryName: 'ملابس بيتي', suggestedQty: '4 - 6 أطقم', priority: 'أساسي' },
  { id: 'c3', name: 'ترنجات بيتي شيك صيفي وشتوي', categorySlug: 'homewear', categoryName: 'ملابس بيتي', suggestedQty: '6 - 8 أطقم', priority: 'مهم' },
  { id: 'c4', name: 'كاش مايوه وأطقم قطن ناعمة خفيفة', categorySlug: 'homewear', categoryName: 'ملابس بيتي', suggestedQty: '6 أطقم', priority: 'مهم' },

  // Outwear
  { id: 'c5', name: 'دريسات خروج واستقبال أنيقة ومبطنة', categorySlug: 'outwear', categoryName: 'ملابس خروج', suggestedQty: '3 - 4 فساتين', priority: 'أساسي' },
  { id: 'c6', name: 'عبايات استقبال وزيارات عائلية مطرزة', categorySlug: 'outwear', categoryName: 'ملابس خروج', suggestedQty: '2 - 3 عبايات', priority: 'مهم' },

  // Lingerie
  { id: 'c7', name: 'طقم لانجري ليلة الزفاف (أوف وايت أو أبيض)', categorySlug: 'lingerie', categoryName: 'لانجري', suggestedQty: '1 طقم ملكي', priority: 'أساسي' },
  { id: 'c8', name: 'قمصان نوم ستان ودانتيل طويلة وقصيرة', categorySlug: 'lingerie', categoryName: 'لانجري', suggestedQty: '8 - 12 قطعة', priority: 'أساسي' },
  { id: 'c9', name: 'أطقم بيبي دول وروب كيمونو حريري', categorySlug: 'lingerie', categoryName: 'لانجري', suggestedQty: '4 - 6 قطع', priority: 'مهم' },

  // Appliances
  { id: 'c10', name: 'محضر طعام ومفرمة متكاملة (30+ وظيفة)', categorySlug: 'electrical-appliances', categoryName: 'أجهزة كهربائية', suggestedQty: '1 جهاز أساسي', priority: 'أساسي' },
  { id: 'c11', name: 'مكواة بخار عمودية للملابس والمفروشات', categorySlug: 'electrical-appliances', categoryName: 'أجهزة كهربائية', suggestedQty: '1 جهاز', priority: 'مهم' },
  { id: 'c12', name: 'مكنسة كهربائية قوية لغرف الاستقبال', categorySlug: 'electrical-appliances', categoryName: 'أجهزة كهربائية', suggestedQty: '1 جهاز', priority: 'أساسي' },

  // Kitchenware
  { id: 'c13', name: 'طقم حلل جرانيت تركي أصلي (12 - 14 قطعة)', categorySlug: 'kitchenware', categoryName: 'أدوات منزلية ومطبخ', suggestedQty: '1 طقم كامل', priority: 'أساسي' },
  { id: 'c14', name: 'طقم عشاء وسفرة بورسلين مذهب للنيش', categorySlug: 'kitchenware', categoryName: 'أدوات منزلية ومطبخ', suggestedQty: '1 طقم (66+ قطعة)', priority: 'أساسي' },
  { id: 'c15', name: 'طقم صواني فرن بايركس وطواجن', categorySlug: 'kitchenware', categoryName: 'أدوات منزلية ومطبخ', suggestedQty: '2 طقم', priority: 'مهم' },
  { id: 'c16', name: 'طقم توزيع سيليكون حراري وسكاكين جرانيت', categorySlug: 'kitchenware', categoryName: 'أدوات منزلية ومطبخ', suggestedQty: '1 - 2 طقم', priority: 'مهم' },

  // Furnishings
  { id: 'c17', name: 'لحاف عروسة ملكي قطيفة وستان للسرير الكبير', categorySlug: 'home-furnishings', categoryName: 'مفروشات منزلية', suggestedQty: '1 طقم رئيسي', priority: 'أساسي' },
  { id: 'c18', name: 'أطقم ملايات قطن مصري 100% بتطريز جوبير', categorySlug: 'home-furnishings', categoryName: 'مفروشات منزلية', suggestedQty: '6 - 8 أطقم', priority: 'أساسي' },
  { id: 'c19', name: 'بطاطين حفر ليزر إسباني وكوفرتات سرير', categorySlug: 'home-furnishings', categoryName: 'مفروشات منزلية', suggestedQty: '2 - 3 بطاطين', priority: 'مهم' },
  { id: 'c20', name: 'طقم بشاكير وفوط عرايس مطرزة قطن بيور', categorySlug: 'home-furnishings', categoryName: 'مفروشات منزلية', suggestedQty: '2 علبة فوط + 2 برنس', priority: 'أساسي' },
];

const CHECKLIST_STORAGE_KEY = 'roka_trousseau_checklist_checked';

export const TrousseauChecklistModal: React.FC<TrousseauChecklistModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [checkedIds]);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredItems = DEFAULT_CHECKLIST.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.categorySlug === activeFilter;
  });

  const progressPercent = Math.round((checkedIds.length / DEFAULT_CHECKLIST.length) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#11151f] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#161b27] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#e0a96d]/10 text-[#e0a96d]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                قائمة ومساعد جهاز العروسة الذكي
              </h3>
              <p className="text-xs text-slate-400">
                دليلكِ المنظم لمستلزمات جهاز العروسة في سوهاج وجهينة من روكا مول
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-5 py-4 bg-[#141824] border-b border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">نسبة اكتمال تجهيز جهازك:</span>
            <span className="text-[#e0a96d] tabular-nums font-mono">
              {checkedIds.length} من {DEFAULT_CHECKLIST.length} بند ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-[#e0a96d] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-5 py-2.5 bg-[#0f121a] border-b border-slate-800/60 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#e0a96d] text-[#0c0e14] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الكل ({DEFAULT_CHECKLIST.length})
          </button>
          <button
            onClick={() => setActiveFilter('homewear')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'homewear'
                ? 'bg-[#e0a96d] text-[#0c0e14] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ملابس بيتي
          </button>
          <button
            onClick={() => setActiveFilter('lingerie')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'lingerie'
                ? 'bg-[#e0a96d] text-[#0c0e14] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            لانجري
          </button>
          <button
            onClick={() => setActiveFilter('home-furnishings')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'home-furnishings'
                ? 'bg-[#e0a96d] text-[#0c0e14] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مفروشات
          </button>
          <button
            onClick={() => setActiveFilter('electrical-appliances')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'electrical-appliances'
                ? 'bg-[#e0a96d] text-[#0c0e14] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            أجهزة كهربائية
          </button>
          <button
            onClick={() => setActiveFilter('kitchenware')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'kitchenware'
                ? 'bg-[#e0a96d] text-[#0c0e14] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            أدوات مطبخ
          </button>
        </div>

        {/* Checklist Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {filteredItems.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-[#151d18] border-emerald-900/60 opacity-80'
                    : 'bg-[#151923] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <span
                      className={`text-sm font-medium block ${
                        isChecked ? 'line-through text-slate-400' : 'text-slate-200'
                      }`}
                    >
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-[#e0a96d]">{item.categoryName}</span>
                      <span aria-hidden="true">·</span>
                      <span>الكمية المقترحة: {item.suggestedQty}</span>
                      <span aria-hidden="true">·</span>
                      <span className={item.priority === 'أساسي' ? 'text-amber-300' : 'text-slate-400'}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {onSelectCategory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onSelectCategory(item.categorySlug);
                    }}
                    title="تصفحي منتجات هذا القسم"
                    className="p-1.5 text-slate-400 hover:text-[#e0a96d] hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0c0f16] flex items-center justify-between text-xs text-slate-400">
          <span>يتم حفظ تقدمكِ تلقائياً على جهازك</span>
          <button
            onClick={() => setCheckedIds([])}
            className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            إعادة تعيين القائمة
          </button>
        </div>
      </div>
    </div>
  );
};
