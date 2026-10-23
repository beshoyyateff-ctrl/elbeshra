import React, { useState, useMemo } from 'react';
import { ArrowRight, Filter, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { Category, Product } from '../types.js';
import { ProductCard } from '../components/ProductCard.js';

interface CategoryPageProps {
  category: Category;
  allCategories: Category[];
  products: Product[];
  onSelectCategory: (slug: string) => void;
  onViewProduct: (productId: string) => void;
  onBackToHome: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  allCategories,
  products,
  onSelectCategory,
  onViewProduct,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categoryProducts = useMemo(() => {
    let list = products.filter((p) => p.categoryId === category.id);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (inStockOnly) {
      list = list.filter((p) => p.isAvailable);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, category.id, searchQuery, inStockOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button
          onClick={onBackToHome}
          className="hover:text-white transition-colors cursor-pointer"
        >
          الرئيسية
        </button>
        <span aria-hidden="true">/</span>
        <span>أقسام المتجر</span>
        <span aria-hidden="true">/</span>
        <span className="text-[#e0a96d] font-medium">{category.name}</span>
      </div>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#141824] border border-slate-800 p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">
            قسم جهاز العروسة
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {category.description}
          </p>
          <div className="text-xs text-slate-400 pt-1">
            إجمالي المنتجات المتاحة: <span className="text-[#e0a96d] font-bold">{categoryProducts.length}</span> منتج
          </div>
        </div>
      </div>

      {/* Category Quick Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {allCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.slug)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              c.id === category.id
                ? 'bg-[#e0a96d] text-[#0c0e14] font-bold'
                : 'bg-[#151924] text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#10141d] p-4 rounded-2xl border border-slate-800">
        {/* Search within Category */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder={`بحث في ${category.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
          />
        </div>

        {/* Sort and Filters */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded bg-[#171d2b] border-slate-700 text-[#e0a96d] focus:ring-0"
            />
            <span>المتوفر فقط</span>
          </label>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#171d2b] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#e0a96d] cursor-pointer"
            >
              <option value="newest">الأحدث وصولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#121622] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
            <PackageSearch className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-200">
            لا توجد منتجات مطابقة في هذا القسم حالياً
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            يمكنكِ تجربة كلمات بحث أخرى أو الاطلاع على باقي أقسام جهاز العروسة بروكا مول.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="px-4 py-2 text-xs font-semibold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-colors cursor-pointer"
          >
            إعادة تعيين البحث
          </button>
        </div>
      )}
    </div>
  );
};
