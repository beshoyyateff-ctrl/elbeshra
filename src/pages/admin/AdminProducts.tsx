import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '../../types.js';
import { api } from '../../services/api.js';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => Promise<void>;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onRefresh,
  isAddModalOpen: propIsAddModalOpen,
  onCloseAddModal: propOnCloseAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [featuresStr, setFeaturesStr] = useState('');
  const [badge, setBadge] = useState('');
  const [trousseauTip, setTrousseauTip] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Uploading state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Status
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Open modal if triggered by parent
  React.useEffect(() => {
    if (propIsAddModalOpen) {
      handleOpenCreate();
    }
  }, [propIsAddModalOpen]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setOldPrice('');
    setImage('');
    setDescription('');
    setFeaturesStr('');
    setBadge('');
    setTrousseauTip('');
    setIsAvailable(true);
    setIsFeatured(false);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setPrice(String(p.price));
    setOldPrice(p.oldPrice ? String(p.oldPrice) : '');
    setImage(p.image);
    setDescription(p.description);
    setFeaturesStr(p.features ? p.features.join('\n') : '');
    setBadge(p.badge || '');
    setTrousseauTip(p.trousseauTip || '');
    setIsAvailable(p.isAvailable);
    setIsFeatured(p.isFeatured);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    if (propOnCloseAddModal) propOnCloseAddModal();
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جداً، الحد الأقصى 5 ميجابايت');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      const res = await api.upload.uploadImage(file);
      setImage(res.url);
    } catch (err: any) {
      setUploadError(err.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ text: 'يرجى إدخال اسم المنتج', isError: true });
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setFeedback({ text: 'يرجى إدخال سعر صحيح بالجنيه المصري', isError: true });
      return;
    }

    const features = featuresStr
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: Partial<Product> = {
      name: name.trim(),
      categoryId,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      image: image.trim() || '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
      description: description.trim(),
      features,
      badge: badge.trim() || undefined,
      trousseauTip: trousseauTip.trim() || undefined,
      isAvailable,
      isFeatured,
    };

    try {
      setLoading(true);
      if (editingProduct) {
        await api.products.update(editingProduct.id, payload);
        setFeedback({ text: `تم تحديث المنتج "${name}" بنجاح`, isError: false });
      } else {
        await api.products.create(payload);
        setFeedback({ text: `تمت إضافة المنتج "${name}" بنجاح إلى المعرض`, isError: false });
      }
      handleCloseModal();
      await onRefresh();
    } catch (err: any) {
      setFeedback({ text: err.message || 'حدث خطأ أثناء حفظ المنتج', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.products.delete(id);
      setDeleteConfirmId(null);
      setFeedback({ text: 'تم حذف المنتج بنجاح', isError: false });
      await onRefresh();
    } catch (err: any) {
      setFeedback({ text: err.message || 'فشل حذف المنتج', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailable = async (p: Product) => {
    try {
      await api.products.update(p.id, { isAvailable: !p.isAvailable });
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'فشل تحديث الحالة');
    }
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCat !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, selectedCat, search]);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#e0a96d]" />
            <span>إدارة منتجات جهاز العروسة ({products.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وتعديل الأسعار والمواصفات وصور منتجات المعرض
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Alerts */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            feedback.isError
              ? 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
              : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121622] p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الكود..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">القسم:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-[#171d2b] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#e0a96d] cursor-pointer w-full sm:w-auto"
          >
            <option value="all">كافة الأقسام ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#121622] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#171c2b] text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">المنتج</th>
                <th className="py-3.5 px-4">القسم</th>
                <th className="py-3.5 px-4">السعر (ج.م)</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4">مميز</th>
                <th className="py-3.5 px-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    لا توجد منتجات مطابقة لخيارات البحث
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-850/40 transition-colors">
                    {/* Product Cell */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-100 block line-clamp-1">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{prod.id} {prod.badge && `· ${prod.badge}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-[11px]">
                        {prod.categoryName || 'عام'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#e0a96d] tabular-nums text-sm">
                          {prod.price.toLocaleString('ar-EG')} ج.م
                        </span>
                        {prod.oldPrice && (
                          <span className="block text-[10px] text-slate-500 line-through tabular-nums">
                            {prod.oldPrice.toLocaleString('ar-EG')} ج.م
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleAvailable(prod)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                          prod.isAvailable
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                        }`}
                      >
                        {prod.isAvailable ? 'متوفر' : 'غير متوفر'}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="py-3.5 px-4">
                      {prod.isFeatured ? (
                        <span className="text-amber-400 text-[11px] inline-flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3 h-3" /> مميز
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">عادي</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          title="تعديل المنتج"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prod.id)}
                          title="حذف المنتج"
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-right">
            <h3 className="text-base font-bold text-white">تأكيد حذف المنتج</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا المنتج من المعرض وقاعدة البيانات؟ هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors cursor-pointer"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 text-right shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد لجهاز العروسة'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">اسم المنتج الكامل:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: طقم روب عروسة ستان حريري 3 قطع مطرز"
                  className="w-full px-3 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
                  required
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">القسم:</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-[#e0a96d] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">شارة مميزة (اختياري):</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="مثال: جهاز العروسة المميز / الأكثر طلباً"
                    className="w-full px-3 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">السعر الحالي (جنيه مصري):</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: 1850"
                    className="w-full px-3 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">السعر قبل الخصم (اختياري):</label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="مثال: 2200"
                    className="w-full px-3 py-2.5 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="space-y-2 p-4 bg-[#161a25] rounded-2xl border border-slate-800">
                <label className="text-slate-200 font-semibold block">صورة المنتج:</label>

                {uploadError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-[11px] text-rose-300">
                    {uploadError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* File Upload Input */}
                  <label className="w-full sm:w-auto px-4 py-2 bg-[#1f2638] hover:bg-[#28324a] text-slate-200 border border-slate-700 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-[#e0a96d]" />
                    <span>{uploading ? 'جاري الرفع...' : 'رفع صورة من الجهاز'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>

                  <span className="text-slate-500 text-[11px]">أو أدخل رابط الصورة مباشرة:</span>
                </div>

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://... أو /uploads/product_..."
                  className="w-full px-3 py-2 bg-[#121622] border border-slate-700/80 rounded-xl text-slate-100 text-xs"
                />

                {image && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={image}
                      alt="معاينة"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700 bg-slate-800"
                    />
                    <span className="text-[11px] text-emerald-400">تم تحديد الصورة بنجاح</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">وصف وتفاصيل المنتج:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="اكتب وصفاً مفصلاً للمنتج، خامات الصنع، ومناسبته للعروسة..."
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                />
              </div>

              {/* Features */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  المميزات والمواصفات (ميزة في كل سطر):
                </label>
                <textarea
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  rows={3}
                  placeholder="ستان تركي ناعم&#10;تطريز دانتيل فرنسي&#10;ضمان سنتين"
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100 font-mono text-[11px]"
                />
              </div>

              {/* Bridal Tip */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">نصيحة العروسة (تظهر في صندوق مميز):</label>
                <input
                  type="text"
                  value={trousseauTip}
                  onChange={(e) => setTrousseauTip(e.target.value)}
                  placeholder="مثال: قطعة أساسية في شنطة صباحية العروسة..."
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-slate-100"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded bg-[#171d2b] border-slate-700 text-[#e0a96d]"
                  />
                  <span>متوفر للطلب والمعاينة</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-[#171d2b] border-slate-700 text-[#e0a96d]"
                  />
                  <span>تمييز في الصفحة الرئيسية (الأكثر طلباً)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : editingProduct ? 'تحديث المنتج' : 'إضافة المنتج للمتجر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
