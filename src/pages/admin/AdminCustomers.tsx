import React, { useState, useEffect } from 'react';
import { Users, Search, MessageCircle, Phone, MapPin, Calendar, X } from 'lucide-react';
import { User } from '../../types.js';
import { api } from '../../services/api.js';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  const fetchCustomers = async (q?: string) => {
    try {
      setLoading(true);
      const data = await api.customers.getAll(q);
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(search);
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#e0a96d]" />
            <span>سجل عملاء روكا مول ({customers.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            بيانات العملاء المسجلين وعناوين التوصيل في سوهاج ومراكز الصعيد
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الهاتف أو المدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-[#171d2b] border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#e0a96d]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121622] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#171c2b] text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">اسم العميل</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4">المدينة / المركز</th>
                <th className="py-3.5 px-4">العنوان التفصيلي</th>
                <th className="py-3.5 px-4">تاريخ التسجيل</th>
                <th className="py-3.5 px-4 text-left">التواصل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    جاري تحميل سجل العملاء...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    لم يتم العثور على عملاء مسجلين
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e0a96d]/15 text-[#e0a96d] font-bold flex items-center justify-center text-xs shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block">{c.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">#{c.id.substring(0, 12)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-200" dir="ltr">
                      {c.phone}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {c.city || 'سوهاج'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {c.address || 'لم يحدد'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString('ar-EG')}
                    </td>

                    <td className="py-3.5 px-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          التفاصيل
                        </button>
                        <a
                          href={`https://wa.me/20${c.phone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/40 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">بيانات العميل الكاملة</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">الاسم:</span>
                <span className="text-sm font-bold text-white">{selectedCustomer.name}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">رقم الهاتف:</span>
                <span className="text-slate-200 font-mono" dir="ltr">{selectedCustomer.phone}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">البريد الإلكتروني:</span>
                <span className="text-slate-200 font-mono">{selectedCustomer.email}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">المركز / المحافظة:</span>
                <span className="text-slate-200">{selectedCustomer.city || 'سوهاج'}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">العنوان التفصيلي للتوصيل:</span>
                <span className="text-slate-200">{selectedCustomer.address || 'غير مسجل'}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">تاريخ إنشاء الحساب:</span>
                <span className="text-slate-200">{new Date(selectedCustomer.createdAt).toLocaleString('ar-EG')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <a
                href={`https://wa.me/20${selectedCustomer.phone.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#0c0e14] bg-emerald-400 hover:bg-emerald-300 rounded-xl"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>مراسلة العميل عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
