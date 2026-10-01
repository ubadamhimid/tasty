import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { DailySalesRecord } from '../types';
import {
  TrendingUp,
  CreditCard,
  Banknote,
  Calendar,
  Save,
  Trash2,
  Edit2,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  PieChart,
  ArrowUpRight,
  Search,
  Filter
} from 'lucide-react';

export const DailySalesPage: React.FC = () => {
  const [sales, setSales] = useState<DailySalesRecord[]>(StorageService.getDailySales());
  const [stats, setStats] = useState(StorageService.getSalesStats());

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cashAmount, setCashAmount] = useState<string>('');
  const [cardAmount, setCardAmount] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Search & Filter
  const [searchDate, setSearchDate] = useState('');

  const reloadData = () => {
    setSales(StorageService.getDailySales());
    setStats(StorageService.getSalesStats());
  };

  useEffect(() => {
    return StorageService.subscribe(reloadData);
  }, []);

  // Compute live preview
  const numCash = parseFloat(cashAmount) || 0;
  const numCard = parseFloat(cardAmount) || 0;
  const liveTotal = Number((numCash + numCard).toFixed(2));
  const liveCashPct = liveTotal > 0 ? Number(((numCash / liveTotal) * 100).toFixed(1)) : 0;
  const liveCardPct = liveTotal > 0 ? Number((100 - liveCashPct).toFixed(1)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (liveTotal <= 0) {
      alert('يرجى إدخال مبلغ مبيعات صالح للكاش أو الكرت');
      return;
    }

    StorageService.saveDailySale({
      ...(editingId ? { id: editingId } : {}),
      date,
      cashAmount: numCash,
      cardAmount: numCard,
      notes: notes.trim(),
    });

    setSuccessToast(editingId ? 'تم تحديث مبيعات اليوم بنجاح!' : 'تم حفظ مبيعات اليوم وإضافتها للسجل بنجاح!');
    setTimeout(() => setSuccessToast(null), 3000);

    // Reset Form to current date
    setEditingId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setCashAmount('');
    setCardAmount('');
    setNotes('');
  };

  const handleEdit = (record: DailySalesRecord) => {
    setEditingId(record.id);
    setDate(record.date);
    setCashAmount(record.cashAmount.toString());
    setCardAmount(record.cardAmount.toString());
    setNotes(record.notes || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل تود حذف هذا السجل اليومي نهائياً؟')) {
      StorageService.deleteDailySale(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setCashAmount('');
    setCardAmount('');
    setNotes('');
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    let csv = '\uFEFFالتاريخ,مبيعات الكاش (€),مبيعات الكرت PIN (€),الإجمالي (€),نسبة الكاش %,نسبة الكرت %,الملاحظات\n';
    sales.forEach((s) => {
      csv += `"${s.date}",${s.cashAmount},${s.cardAmount},${s.totalAmount},${s.cashPercentage}%,${s.cardPercentage}%,"${s.notes || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasty-sales-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredSales = sales.filter((s) => {
    if (!searchDate) return true;
    return s.date.includes(searchDate) || (s.notes && s.notes.includes(searchDate));
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              المالية والإيرادات
            </span>
          </div>
          <h1 className="font-serif font-black text-xl sm:text-2xl text-tasty-charcoal">
            تقفيل المبيعات اليومية (كاش vs كرت PIN)
          </h1>
          <p className="text-xs text-gray-500">
            تسجيل نهاية كل يوم عمل، ومتابعة نسب المبيعات النقدية والإلكترونية باليورو (€).
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>تصدير إلى Excel / CSV</span>
        </button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: This Week */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500">مبيعات هذا الأسبوع (آخر 7 أيام)</span>
          <div className="text-2xl sm:text-3xl font-serif font-black text-tasty-charcoal mt-1">
            €{stats.week.total.toLocaleString('nl-NL')}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>كاش نقد:</span>
              <strong className="text-emerald-700 font-bold">€{stats.week.cash.toLocaleString('nl-NL')}</strong>
            </div>
            <div className="flex justify-between">
              <span>كرت شبكة PIN:</span>
              <strong className="text-tasty-teal-dark font-bold">€{stats.week.card.toLocaleString('nl-NL')}</strong>
            </div>
          </div>
        </div>

        {/* Stat 2: This Month */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500">مبيعات هذا الشهر الحالي</span>
          <div className="text-2xl sm:text-3xl font-serif font-black text-tasty-teal-dark mt-1">
            €{stats.month.total.toLocaleString('nl-NL')}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>كاش نقد:</span>
              <strong className="text-emerald-700 font-bold">€{stats.month.cash.toLocaleString('nl-NL')}</strong>
            </div>
            <div className="flex justify-between">
              <span>كرت شبكة PIN:</span>
              <strong className="text-tasty-teal-dark font-bold">€{stats.month.card.toLocaleString('nl-NL')}</strong>
            </div>
          </div>
        </div>

        {/* Stat 3: Daily Average */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500">المتوسط اليومي العام</span>
          <div className="text-2xl sm:text-3xl font-serif font-black text-tasty-terracotta mt-1">
            €{stats.averageDaily.toLocaleString('nl-NL')}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            محسوب بناءً على <strong>{stats.all.count}</strong> يوم عمل مسجل في النظام
          </div>
        </div>
      </div>

      {/* Main Form: Daily Sales Entry & Realtime Split */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
          <div>
            <h2 className="font-cairo font-bold text-base text-tasty-charcoal">
              {editingId ? 'تعديل تسجيل مبيعات يوم سابق' : 'تسجيل مبيعات اليوم (تقفيل الصندوق)'}
            </h2>
            <p className="text-xs text-gray-400">
              أدخل مجموع الكاش ومجموع الكرت المسحوب من جهاز الدفع بنهاية اليوم
            </p>
          </div>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-red-600 hover:underline font-bold"
            >
              إلغاء التعديل
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Date Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>تاريخ اليوم</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal font-mono text-sm bg-white"
              />
            </div>

            {/* Cash Input */}
            <div>
              <label className="block text-xs font-bold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>مبيعات الكاش النقدية (€)</span>
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full pr-8 pl-3 py-2.5 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-500 font-mono text-base font-bold text-emerald-800 bg-emerald-50/20"
                />
              </div>
            </div>

            {/* Card / PIN Input */}
            <div>
              <label className="block text-xs font-bold text-tasty-teal-dark mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-tasty-teal" />
                <span>مبيعات الشبكة / الكرت PIN (€)</span>
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  className="w-full pr-8 pl-3 py-2.5 rounded-xl border border-tasty-teal/30 focus:outline-none focus:border-tasty-teal font-mono text-base font-bold text-tasty-teal-dark bg-tasty-teal-light/30"
                />
              </div>
            </div>

          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">ملاحظات اليوم (اختياري)</label>
            <input
              type="text"
              placeholder="مثال: ذروة عطلة نهاية الأسبوع، طلبية مناسبات خاصة، صيانة ماكينة القلي..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal text-xs bg-white"
            />
          </div>

          {/* Live Preview Bar */}
          <div className="p-4 rounded-2xl bg-tasty-bg-warm border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-600">المجموع الإجمالي المحسوب:</span>
              <span className="font-serif font-black text-lg text-tasty-charcoal">€{liveTotal}</span>
            </div>

            {/* Split Visual Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-200">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${liveCashPct}%` }}
                title={`كاش: ${liveCashPct}%`}
              />
              <div
                className="bg-tasty-teal h-full transition-all duration-300"
                style={{ width: `${liveCardPct}%` }}
                title={`كرت: ${liveCardPct}%`}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                كاش: €{numCash} (<strong>{liveCashPct}%</strong>)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-tasty-teal inline-block" />
                كرت PIN: €{numCard} (<strong>{liveCardPct}%</strong>)
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold text-xs sm:text-sm shadow-md shadow-tasty-teal/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'حفظ التعديلات' : 'تسجيل وحفظ تقفيل اليوم'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-cairo font-bold text-sm sm:text-base text-tasty-charcoal">سجل اليوميات السابقة</h3>
            <p className="text-xs text-gray-400">أرشيف تقفيل الصندوق والمبيعات اليومية</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث بالتاريخ أو الملاحظة..."
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full sm:w-60 pr-9 pl-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-tasty-bg-warm border-b border-gray-100 text-gray-500 font-bold">
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">مبيعات الكاش (€)</th>
                <th className="p-3.5">مبيعات الكرت PIN (€)</th>
                <th className="p-3.5">الإجمالي الكلي (€)</th>
                <th className="p-3.5">نسبة التقسيم</th>
                <th className="p-3.5">الملاحظات</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-tasty-bg-warm/60 transition-colors">
                  <td className="p-3.5 font-cairo font-bold text-tasty-charcoal whitespace-nowrap">
                    {sale.date}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700 whitespace-nowrap">
                    €{sale.cashAmount}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-tasty-teal-dark whitespace-nowrap">
                    €{sale.cardAmount}
                  </td>
                  <td className="p-3.5 font-mono font-black text-sm text-tasty-charcoal whitespace-nowrap">
                    €{sale.totalAmount}
                  </td>
                  <td className="p-3.5 min-w-[140px]">
                    <div className="space-y-1">
                      <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${sale.cashPercentage}%` }} />
                        <div className="bg-tasty-teal h-full" style={{ width: `${sale.cardPercentage}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>{sale.cashPercentage}% كاش</span>
                        <span>{sale.cardPercentage}% كرت</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-gray-500 max-w-xs truncate">
                    {sale.notes || '—'}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(sale)}
                        className="p-1.5 text-gray-400 hover:text-tasty-teal rounded-lg hover:bg-tasty-teal-light transition-colors"
                        title="تعديل هذا اليوم"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="حذف هذا اليوم"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
