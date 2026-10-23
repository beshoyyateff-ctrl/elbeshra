import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, X, AlertCircle, Check } from 'lucide-react';
import { Category, Product } from '../../types.js';
import { api } from '../../services/api.js';

interface AdminCategoriesProps {
  categories: Category[];
  products: Product[];
  onRefresh: () => Promise<void>;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  products,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setDisplayOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description);
    setImage(c.image);
    setDisplayOrder(c.displayOrder);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ text: 'يرجى إدخال اسم القسم', isError: true });
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      image: image.trim() || '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
      displayOrder: Number(displayOrder),
    };

    try {
      setLoading(true);
      if (editingCategory) {
        await api.categories.update(editingCategory.id, payload);
        setFeedback({ text: `تم تحديث قسم "${name}" بنجاح`, isError: false });
      } else {
        await api.categories.create(payload);
        setFeedback({ text: `تمت إضافة قسم "${name}" بنجاح`, isError: false });
      }
      setIsModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      setFeedback({ text: err.message || 'فشل حفظ القسم', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.categories.delete(id);
      setDeleteConfirmId(null);
      setFeedback({ text: 'تم حذف القسم بنجاح', isError: false });
      await onRefresh();
    } catch (err: any) {
      setFeedback({ text: err.message || 'فشل حذف القسم', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#e0a96d]" />
            <span>أقسام متجر روكا مول ({categories.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إدارة تصنيفات مستلزمات جهاز العروسة وترتيب ظهورها
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

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

      {/* Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-[#121622] border border-slate-800 rounded-3xl overflow-hidden p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-18 h-18 rounded-2xl object-cover bg-slate-800 shrink-0 border border-slate-700/80"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100">{cat.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      ترتيب #{cat.displayOrder}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  عدد المنتجات: <strong className="text-[#e0a96d]">{count}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="تعديل القسم"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="حذف القسم"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-right">
            <h3 className="text-base font-bold text-white">حذف القسم</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تأكيد حذف القسم من النظام. لن يتم الحذف إذا كانت هناك منتجات مسجلة تابعة له.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                {editingCategory ? 'تعديل بيانات القسم' : 'إضافة قسم جديد'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">اسم القسم:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: ملابس بيتي"
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">الاسم اللطيف (Slug بالإنجليزية):</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="مثال: homewear"
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">رابط صورة القسم:</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="رابط الصورة أو مسارها"
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">ترتيب العرض:</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">وصف القسم للعرائس:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#171d2b] border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-[#0c0e14] bg-[#e0a96d] hover:bg-[#f3d3b0] rounded-xl cursor-pointer"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ القسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
