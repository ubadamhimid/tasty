import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { DebtRecord, DebtPayment, DebtType, DebtStatus, PaymentMethod } from '../types';
import {
  Scale,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Calendar,
  CreditCard,
  Banknote,
  Search,
  Filter,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  History,
  FileText
} from 'lucide-react';

const STATUS_LABELS: Record<DebtStatus, { label: string; color: string }> = {
  unpaid: { label: 'غير مدفوع', color: 'bg-red-100 text-red-800 border-red-200' },
  partially_paid: { label: 'مدفوع جزئياً', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  paid: { label: 'مسدد بالكامل', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  cash: 'كاش نقدي',
  bank_transfer: 'تحويل بنكي',
  pin: 'بطاقة PIN / شبكة',
};

export const DebtsPage: React.FC = () => {
  const [debts, setDebts] = useState<DebtRecord[]>(StorageService.getDebts());
  const [stats, setStats] = useState(StorageService.getDebtStats());

  // Filter State
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'payable' | 'receivable'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | DebtStatus>('all');
  const [search, setSearch] = useState('');

  // Expandable Debt details (for viewing payments ledger)
  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);

  // New Debt Modal
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [debtForm, setDebtForm] = useState<{
    partyName: string;
    type: DebtType;
    category: 'supplier' | 'customer' | 'other';
    phone: string;
    totalAmount: string;
    createdDate: string;
    dueDate: string;
    description: string;
  }>({
    partyName: '',
    type: 'payable',
    category: 'supplier',
    phone: '',
    totalAmount: '',
    createdDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
  });

  // Payment Modal
  const [payingDebt, setPayingDebt] = useState<DebtRecord | null>(null);
  const [paymentForm, setPaymentForm] = useState<{
    amount: string;
    date: string;
    method: PaymentMethod;
    note: string;
  }>({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'bank_transfer',
    note: '',
  });

  const reloadData = () => {
    setDebts(StorageService.getDebts());
    setStats(StorageService.getDebtStats());
  };

  useEffect(() => {
    return StorageService.subscribe(reloadData);
  }, []);

  // --------------------------------------------------------------------------
  // Debt Creation
  // --------------------------------------------------------------------------
  const handleSaveDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(debtForm.totalAmount);
    if (!debtForm.partyName.trim() || isNaN(amount) || amount <= 0) {
      alert('يرجى إدخال اسم الجهة ومبلغ صالح');
      return;
    }

    StorageService.saveDebt({
      partyName: debtForm.partyName.trim(),
      type: debtForm.type,
      category: debtForm.category,
      phone: debtForm.phone.trim(),
      totalAmount: amount,
      createdDate: debtForm.createdDate,
      dueDate: debtForm.dueDate,
      description: debtForm.description.trim(),
    });

    setIsDebtModalOpen(false);
    setDebtForm({
      partyName: '',
      type: 'payable',
      category: 'supplier',
      phone: '',
      totalAmount: '',
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      description: '',
    });
  };

  const handleDeleteDebt = (id: string) => {
    if (window.confirm('هل تود حذف قيد الدين هذا وسجل دفعاته نهائياً؟')) {
      setDebts((prev) => prev.filter((d) => d.id !== id));
      StorageService.deleteDebt(id);
    }
  };

  // --------------------------------------------------------------------------
  // Payment Registration
  // --------------------------------------------------------------------------
  const openPaymentModal = (debt: DebtRecord) => {
    setPayingDebt(debt);
    setPaymentForm({
      amount: debt.remainingAmount.toString(),
      date: new Date().toISOString().split('T')[0],
      method: debt.type === 'payable' ? 'bank_transfer' : 'cash',
      note: '',
    });
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingDebt) return;

    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('يرجى إدخال مبلغ دفعة صحيح');
      return;
    }

    if (amount > payingDebt.remainingAmount) {
      if (!window.confirm(`المبلغ المدخل (€${amount}) أكبر من الرصيد المتبقي (€${payingDebt.remainingAmount}). هل تود المتابعة؟`)) {
        return;
      }
    }

    StorageService.addDebtPayment(payingDebt.id, {
      amount,
      date: paymentForm.date,
      method: paymentForm.method,
      note: paymentForm.note.trim(),
    });

    setPayingDebt(null);
  };

  // Filtered List
  const filteredDebts = debts.filter((d) => {
    if (activeTypeTab !== 'all' && d.type !== activeTypeTab) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = d.partyName.toLowerCase().includes(q);
      const matchDesc = d.description?.toLowerCase().includes(q);
      const matchPhone = d.phone?.includes(q);
      if (!matchName && !matchDesc && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              الذمم والالتزامات
            </span>
          </div>
          <h1 className="font-serif font-black text-xl sm:text-2xl text-tasty-charcoal">
            سجل الديون والمدفوعات (موردين وزبائن)
          </h1>
          <p className="text-xs text-gray-500">
            متابعة الديون المستحقة علينا للموردين، والديون المستحقة لنا على الزبائن وتسجيل الدفعات الجزئية.
          </p>
        </div>

        <button
          onClick={() => setIsDebtModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-tasty-teal hover:bg-tasty-teal-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قيد دين جديد</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Payable Summary (علينا للموردين) */}
        <div className="bg-white rounded-3xl p-5 border border-red-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-700 flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" /> ديون علينا للموردين (Payable)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold">
              مطلوب سداده
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-red-400 font-sans">€</span>
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-red-600 tabular-nums">
              {stats.payable.remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>تم سداده: €{stats.payable.paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="font-bold text-gray-400">إجمالي: €{stats.payable.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Receivable Summary (لنا على الزبائن) */}
        <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> ديون لنا على الزبائن (Receivable)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
              مطلوب تحصيله
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-blue-400 font-sans">€</span>
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-blue-600 tabular-nums">
              {stats.receivable.remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>تم تحصيله: €{stats.receivable.paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="font-bold text-gray-400">إجمالي: €{stats.receivable.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500">صافي الميزان (لنا - علينا)</span>
          <div className="flex items-baseline gap-1 mt-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-gray-400 font-sans">€</span>
            <span
              className={`text-2xl sm:text-3xl font-black font-sans tracking-tight tabular-nums ${
                stats.netBalance >= 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {Math.abs(stats.netBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            {stats.netBalance >= 0
              ? 'الديون المطلوب تحصيلها تغطي التزامات الموردين'
              : 'الالتزامات المستحقة للموردين تفوق الذمم المدينة'}
          </div>
        </div>

      </div>

      {/* Tabs & Search Filters */}
      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-tasty-bg-warm p-1 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTypeTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTypeTab === 'all'
                ? 'bg-tasty-charcoal text-white shadow-2xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            الكل ({debts.length})
          </button>
          <button
            onClick={() => setActiveTypeTab('payable')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTypeTab === 'payable'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            علينا للموردين ({debts.filter((d) => d.type === 'payable').length})
          </button>
          <button
            onClick={() => setActiveTypeTab('receivable')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTypeTab === 'receivable'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            لنا على الزبائن ({debts.filter((d) => d.type === 'receivable').length})
          </button>
        </div>

        {/* Status Filter & Search */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
          >
            <option value="all">كافة الحالات</option>
            <option value="unpaid">غير مدفوع</option>
            <option value="partially_paid">مدفوع جزئياً</option>
            <option value="paid">مسدد بالكامل</option>
          </select>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرقم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 pl-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal w-44 sm:w-56"
            />
          </div>
        </div>

      </div>

      {/* Debts List Cards */}
      <div className="space-y-3.5">
        {filteredDebts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-gray-700">لا توجد قيود ديون مطابقة</h3>
            <p className="text-xs text-gray-400 mt-1">يمكنك إضافة قيد دين جديد للموردين أو الزبائن</p>
          </div>
        ) : (
          filteredDebts.map((debt) => {
            const isPayable = debt.type === 'payable';
            const statusConfig = STATUS_LABELS[debt.status];
            const isExpanded = expandedDebtId === debt.id;
            const progressPct = debt.totalAmount > 0
              ? Math.min(100, Math.round((debt.paidAmount / debt.totalAmount) * 100))
              : 0;

            return (
              <div
                key={debt.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-sm transition-all overflow-hidden"
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left (RTL): Party & Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isPayable ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {isPayable ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {isPayable ? 'دين علينا (مورد)' : 'دين لنا (زبون)'}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>

                      {debt.dueDate && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> استحقاق: {debt.dueDate}
                        </span>
                      )}
                    </div>

                    <h3 className="font-cairo font-bold text-base text-tasty-charcoal">
                      {debt.partyName}
                    </h3>

                    {debt.description && (
                      <p className="text-xs text-gray-500 mt-0.5 max-w-xl">
                        {debt.description}
                      </p>
                    )}

                    {debt.phone && (
                      <p className="text-xs text-tasty-teal mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span dir="ltr">{debt.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Right (RTL): Amount & Payment actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                    <div className="text-right sm:text-left min-w-[130px]">
                      <div className="text-xs text-gray-400">الرصيد المتبقي:</div>
                      <div
                        className={`flex items-baseline gap-0.5 font-sans font-black text-xl sm:text-2xl tabular-nums ${
                          debt.remainingAmount > 0
                            ? isPayable ? 'text-red-600' : 'text-blue-600'
                            : 'text-emerald-600'
                        }`}
                        dir="ltr"
                      >
                        <span className="text-sm font-bold opacity-60 mr-0.5">€</span>
                        <span>{debt.remainingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium">
                        تم سداد €{debt.paidAmount} من €{debt.totalAmount} ({progressPct}%)
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {debt.remainingAmount > 0 && (
                        <button
                          onClick={() => openPaymentModal(debt)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>تسجيل دفعة سداد</span>
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedDebtId(isExpanded ? null : debt.id)}
                        className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold flex items-center gap-1"
                        title="سجل دفعات هذا الدين"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>({debt.payments.length})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDeleteDebt(debt.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="حذف القيد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Expanded Payment Ledger */}
                {isExpanded && (
                  <div className="bg-tasty-bg-warm/70 p-4 sm:p-5 border-t border-gray-100 animate-fade-in">
                    <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-tasty-teal" />
                      <span>سجل الدفعات المسجلة ({debt.payments.length} دفعات):</span>
                    </h4>

                    {debt.payments.length === 0 ? (
                      <p className="text-xs text-gray-400 py-2">لم يتم تسجيل أي دفعات سداد لهذا القيد بعد.</p>
                    ) : (
                      <div className="space-y-2">
                        {debt.payments.map((p) => (
                          <div
                            key={p.id}
                            className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-emerald-700 text-sm">
                                €{p.amount}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                                {PAYMENT_METHODS[p.method]}
                              </span>
                              {p.note && <span className="text-gray-500">💬 {p.note}</span>}
                            </div>
                            <span className="text-gray-400 font-mono text-[11px]">{p.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ADD NEW DEBT MODAL */}
      {/* -------------------------------------------------------------------- */}
      {isDebtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" dir="rtl">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
            <h3 className="font-cairo font-bold text-base text-tasty-charcoal mb-4">
              إضافة قيد دين جديد
            </h3>

            <form onSubmit={handleSaveDebt} className="space-y-3.5">
              
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">نوع الدين</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDebtForm({ ...debtForm, type: 'payable', category: 'supplier' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      debtForm.type === 'payable'
                        ? 'bg-red-50 text-red-700 border-red-300 shadow-2xs'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    دين علينا (للموردين)
                  </button>

                  <button
                    type="button"
                    onClick={() => setDebtForm({ ...debtForm, type: 'receivable', category: 'customer' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      debtForm.type === 'receivable'
                        ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    دين لنا (على الزبائن)
                  </button>
                </div>
              </div>

              {/* Party Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اسم الجهة / الشخص</label>
                <input
                  type="text"
                  placeholder="مثال: مورد اللحوم الأندلس، شركة الخضار، زبون حفل..."
                  value={debtForm.partyName}
                  onChange={(e) => setDebtForm({ ...debtForm, partyName: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>

              {/* Phone & Total Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">المبلغ الإجمالي (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="0.00"
                    value={debtForm.totalAmount}
                    onChange={(e) => setDebtForm({ ...debtForm, totalAmount: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف (اختياري)</label>
                  <input
                    type="tel"
                    placeholder="+31 6 ..."
                    value={debtForm.phone}
                    onChange={(e) => setDebtForm({ ...debtForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Created Date & Due Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الإنشاء</label>
                  <input
                    type="date"
                    value={debtForm.createdDate}
                    onChange={(e) => setDebtForm({ ...debtForm, createdDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الاستحقاق (اختياري)</label>
                  <input
                    type="date"
                    value={debtForm.dueDate}
                    onChange={(e) => setDebtForm({ ...debtForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">التفاصيل ورقم الفاتورة</label>
                <textarea
                  rows={2}
                  placeholder="مثال: فاتورة توريد رقم 5543 الخاصة بشهر أكتوبر..."
                  value={debtForm.description}
                  onChange={(e) => setDebtForm({ ...debtForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDebtModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white text-xs font-bold shadow-xs"
                >
                  حفظ القيد
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* RECORD PAYMENT MODAL */}
      {/* -------------------------------------------------------------------- */}
      {payingDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" dir="rtl">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
            <h3 className="font-cairo font-bold text-base text-tasty-charcoal">
              تسجيل دفعة سداد
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">
              الجهة: <strong className="text-gray-700">{payingDebt.partyName}</strong> • المتبقي: <strong className="text-red-600">€{payingDebt.remainingAmount}</strong>
            </p>

            <form onSubmit={handleSavePayment} className="space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">المبلغ المدفوع (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={payingDebt.remainingAmount}
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الدفعة</label>
                  <input
                    type="date"
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">طريقة السداد</label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                  >
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="cash">كاش نقدي</option>
                    <option value="pin">بطاقة PIN / شبكة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظة للدفعة (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: دفعة عبر حساب Rabobank، مع السائق..."
                  value={paymentForm.note}
                  onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPayingDebt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white text-xs font-bold shadow-xs"
                >
                  تأكيد وحفظ الدفعة
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
