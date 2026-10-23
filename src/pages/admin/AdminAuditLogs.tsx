import React, { useState, useEffect } from 'react';
import { ClipboardList, ShieldCheck, Clock, User, Globe } from 'lucide-react';
import { AuditLog } from '../../types.js';
import { api } from '../../services/api.js';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin
      .getAuditLogs()
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#e0a96d]" />
          <span>سجل العمليات والرقابة الإدارية ({logs.length})</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          تسجيل لكافة العمليات الإدارية الحساسة: إضافة وتعديل وحذف المنتجات، تحديث الإعدادات، وتسجيل الدخول
        </p>
      </div>

      <div className="bg-[#121622] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#171c2b] text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">الإجراء</th>
                <th className="py-3.5 px-4">المسؤول</th>
                <th className="py-3.5 px-4">التفاصيل</th>
                <th className="py-3.5 px-4">الوقت والتاريخ</th>
                <th className="py-3.5 px-4 text-left">معرف العملية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    جاري تحميل سجل العمليات...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    لا توجد عمليات مسجلة
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-100 px-2.5 py-1 rounded-lg bg-slate-800/80">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#e0a96d]">
                      {log.adminName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 max-w-md">
                      {log.details}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString('ar-EG')}
                    </td>

                    <td className="py-3.5 px-4 text-left font-mono text-[10px] text-slate-500">
                      {log.id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
