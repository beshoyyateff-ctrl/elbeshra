import React, { useState, useMemo } from 'react';
import { Search, PackageSearch, SlidersHorizontal } from 'lucide-react';
import { Product, Category } from '../types.js';
import { ProductCard } from '../components/ProductCard.js';

interface SearchPageProps {
  initialQuery?: string;
  categories: Category[];
  products: Product[];
  onViewProduct: (productId: string) => void;
  onSelectCategory: (slug: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  categories,
  products,
  onViewProduct,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          p.id.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, query, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          البحث في مستلزمات جهاز العروسة
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          ابحثي بسهولة عن المفروشات، الملابس، اللانجري، الأجهزة، والأدوات المنزلية بروكا مول
        </p>

        {/* Search Input Bar */}
        <div className="relative mt-4">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتبي ما تبحثين عنه (مثال: لحاف عروسة، طقم جرانيت، روب ستان، مكواة...)"
            className="w-full pr-12 pl-4 py-3.5 bg-[#141824] border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d] shadow-lg shadow-black/40"
            autoFocus
          />
        </div>
      </div>

      {/* Filter and Sorting Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#10141d] p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#e0a96d] text-[#0c0e14]'
                : 'bg-[#161b26] text-slate-300 hover:text-white'
            }`}
          >
            كل الأقسام ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#e0a96d] text-[#0c0e14]'
                  : 'bg-[#161b26] text-slate-300 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#161b26] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#e0a96d] cursor-pointer"
          >
            <option value="relevance">الترتيب الافتراضي</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      {/* Results Meta */}
      <div className="text-xs text-slate-400">
        تم العثور على <span className="text-[#e0a96d] font-bold">{filteredProducts.length}</span> منتج مطابقة للبحث
      </div>

      {/* Results Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#121622] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
            <PackageSearch className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-200">
            عذراً، لم نجد نتائج مطابقة لبحثكِ
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            تأكدي من صحة الكلمات أو جربي البحث بكلمات عامة مثل "روب"، "مفروشات"، "جرانيت".
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-colors cursor-pointer"
            >
              عرض كافة منتجات المتجر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
