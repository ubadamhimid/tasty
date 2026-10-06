import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import { PurchaseOrder, DailySalesRecord, EmployeeShift, EmployeeAdvance, Employee } from '../types';
import { ShoppingModeModal } from '../components/ShoppingModeModal';
import {
  TrendingUp,
  CreditCard,
  Banknote,
  ShoppingBag,
  Scale,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Users,
  BarChart3,
  PieChart,
  Award,
  AlertCircle,
  Zap,
  ArrowRight,
  Store,
  Wallet,
  Receipt,
  HelpCircle
} from 'lucide-react';

export const AdminDashboardHome: React.FC = () => {
  const [salesStats, setSalesStats] = useState(StorageService.getSalesStats());
  const [debtStats, setDebtStats] = useState(StorageService.getDebtStats());
  const [orders, setOrders] = useState<PurchaseOrder[]>(StorageService.getPurchaseOrders());
  const [recentSales, setRecentSales] = useState<DailySalesRecord[]>(StorageService.getDailySales());
  const [employees, setEmployees] = useState<Employee[]>(StorageService.getEmployees());
  const [shifts, setShifts] = useState<EmployeeShift[]>(StorageService.getEmployeeShifts());
  const [advances, setAdvances] = useState<EmployeeAdvance[]>(StorageService.getEmployeeAdvances());
  const [activeShoppingOrder, setActiveShoppingOrder] = useState<PurchaseOrder | null>(null);

  // Period Filter: 'today' | 'week' | 'month' | 'all'
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // Chart hover state
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const reloadData = () => {
    setSalesStats(StorageService.getSalesStats());
    setDebtStats(StorageService.getDebtStats());
    setOrders(StorageService.getPurchaseOrders());
    setRecentSales(StorageService.getDailySales());
    setEmployees(StorageService.getEmployees());
    setShifts(StorageService.getEmployeeShifts());
    setAdvances(StorageService.getEmployeeAdvances());
  };

  useEffect(() => {
    return StorageService.subscribe(reloadData);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySale = recentSales.find((s) => s.date === todayStr);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrderToShop = pendingOrders.length > 0 ? pendingOrders[0] : (orders[0] || null);

  // Date boundaries
  const { startOfWeekStr, startOfMonthStr } = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMon = (day === 0 ? -6 : 1) - day;
    const mon = new Date(now);
    mon.setDate(now.getDate() + diffToMon);
    const startOfWeek = mon.toISOString().split('T')[0];

    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonth = firstOfMonth.toISOString().split('T')[0];

    return { startOfWeekStr: startOfWeek, startOfMonthStr: startOfMonth };
  }, []);

  // Filtered shifts & advances based on active period
  const periodShifts = useMemo(() => {
    return shifts.filter((s) => {
      if (period === 'today' && s.date !== todayStr) return false;
      if (period === 'week' && s.date < startOfWeekStr) return false;
      if (period === 'month' && s.date < startOfMonthStr) return false;
      return true;
    });
  }, [shifts, period, todayStr, startOfWeekStr, startOfMonthStr]);

  const periodAdvances = useMemo(() => {
    return advances.filter((a) => {
      if (period === 'today' && a.date !== todayStr) return false;
      if (period === 'week' && a.date < startOfWeekStr) return false;
      if (period === 'month' && a.date < startOfMonthStr) return false;
      return true;
    });
  }, [advances, period, todayStr, startOfWeekStr, startOfMonthStr]);

  // Labor stats for the period
  const laborStats = useMemo(() => {
    return StorageService.getEmployeeStats(periodShifts, periodAdvances);
  }, [periodShifts, periodAdvances]);

  // Dynamic Sales metrics for the selected period
  const periodSalesMetrics = useMemo(() => {
    if (period === 'today') {
      const tot = todaySale ? todaySale.totalAmount : 0;
      const cash = todaySale ? todaySale.cashAmount : 0;
      const card = todaySale ? todaySale.cardAmount : 0;
      const cashPct = tot > 0 ? Math.round((cash / tot) * 100) : 0;
      const cardPct = tot > 0 ? Math.round((card / tot) * 100) : 0;
      return { total: tot, cash, card, cashPct, cardPct, label: 'مبيعات اليوم', count: todaySale ? 1 : 0 };
    }
    if (period === 'week') {
      const tot = salesStats.week.total;
      const cash = salesStats.week.cash;
      const card = salesStats.week.card;
      const cashPct = tot > 0 ? Math.round((cash / tot) * 100) : 0;
      const cardPct = tot > 0 ? Math.round((card / tot) * 100) : 0;
      return { total: tot, cash, card, cashPct, cardPct, label: 'مبيعات هذا الأسبوع', count: recentSales.filter(s => s.date >= startOfWeekStr).length };
    }
    if (period === 'month') {
      const tot = salesStats.month.total;
      const cash = salesStats.month.cash;
      const card = salesStats.month.card;
      const cashPct = tot > 0 ? Math.round((cash / tot) * 100) : 0;
      const cardPct = tot > 0 ? Math.round((card / tot) * 100) : 0;
      return { total: tot, cash, card, cashPct, cardPct, label: 'مبيعات هذا الشهر', count: recentSales.filter(s => s.date >= startOfMonthStr).length };
    }
    // all
    const tot = salesStats.all.total;
    const cash = salesStats.all.cash;
    const card = salesStats.all.card;
    const cashPct = tot > 0 ? Math.round((cash / tot) * 100) : 0;
    const cardPct = tot > 0 ? Math.round((card / tot) * 100) : 0;
    return { total: tot, cash, card, cashPct, cardPct, label: 'إجمالي المبيعات التراكمي', count: salesStats.all.count };
  }, [period, todaySale, salesStats, recentSales, startOfWeekStr, startOfMonthStr]);

  // Operational net profit estimation (Revenue - Labor Wages)
  const operationalGrossMargin = useMemo(() => {
    const rev = periodSalesMetrics.total;
    const wages = laborStats.totalWages;
    const margin = rev - wages;
    const laborRatio = rev > 0 ? Math.round((wages / rev) * 100) : 0;
    return { margin, laborRatio };
  }, [periodSalesMetrics.total, laborStats.totalWages]);

  // 7-day Sales Bar Chart Data
  const chartDays = useMemo(() => {
    const days = [];
    const now = new Date();
    // Last 7 days in chronological order
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('ar-NL', { weekday: 'short' });
      const sale = recentSales.find((s) => s.date === dStr);
      days.push({
        date: dStr,
        dayName,
        total: sale ? sale.totalAmount : 0,
        cash: sale ? sale.cashAmount : 0,
        card: sale ? sale.cardAmount : 0,
        hasSale: !!sale,
        isToday: dStr === todayStr,
      });
    }
    const maxVal = Math.max(...days.map((d) => d.total), 500);
    const highestVal = Math.max(...days.map((d) => d.total));
    return { days, maxVal, highestVal };
  }, [recentSales, todayStr]);

  // Today's Staff on duty
  const todayShifts = useMemo(() => {
    return shifts.filter((s) => s.date === todayStr);
  }, [shifts, todayStr]);

  // Unlogged fixed staff check
  const unloggedFixedToday = useMemo(() => {
    return StorageService.getUnloggedFixedStaff(todayStr);
  }, [employees, shifts, todayStr]);

  return (
    <div className="space-y-6">
      
      {/* 1. Executive Top Hero Banner with Status & Period Switcher */}
      <div className="bg-gradient-to-l from-tasty-charcoal via-tasty-teal-dark to-tasty-teal rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>لوحة القيادة التنفيذية للمدير العام</span>
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>المطعم مفتوح • Hilversum</span>
              </span>
              <span className="text-xs text-tasty-sage-light hidden sm:inline">
                {new Date().toLocaleDateString('ar-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
              أهلاً بك في نظام إدارة TASTY
            </h1>
            <p className="text-xs sm:text-sm text-tasty-sage-light/90 max-w-2xl mt-1.5 leading-relaxed">
              تحليل شامل وفوري للأداء المالي، مراقبة الإيرادات والكاش، أجور الكوادر والورديات، وحركة المشتريات والديون.
            </p>
          </div>

          {/* Quick Period Selector Tabs */}
          <div className="bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 flex items-center gap-1 shrink-0 self-start lg:self-center">
            {[
              { id: 'today', label: 'اليوم' },
              { id: 'week', label: 'هذا الأسبوع' },
              { id: 'month', label: 'هذا الشهر' },
              { id: 'all', label: 'كافة الفترات' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  period === p.id
                    ? 'bg-white text-tasty-charcoal shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Executive Alert & Action Highlights (If any actions are pending) */}
      {(!todaySale || unloggedFixedToday.length > 0 || pendingOrders.length > 0) && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-amber-950">تنبيهات العمليات المباشرة لليوم</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/50">
                  مطلوب المتابعة
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-amber-900/80 mt-1">
                {!todaySale && (
                  <span className="flex items-center gap-1 text-rose-700 font-semibold">
                    • لم يتم إدخال مبيعات اليوم بعد
                  </span>
                )}
                {unloggedFixedToday.length > 0 && (
                  <span>• ({unloggedFixedToday.length}) موظف ثابت بانتظار تسجيل الحضور</span>
                )}
                {pendingOrders.length > 0 && (
                  <span>• ({pendingOrders.length}) طلبية شراء بضاعة قيد التجهيز</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!todaySale && (
              <Link
                to="/admin/sales"
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>تسجيل مبيعات اليوم</span>
              </Link>
            )}
            {activeOrderToShop && (
              <button
                onClick={() => setActiveShoppingOrder(activeOrderToShop)}
                className="px-3 py-2 rounded-xl border border-amber-300 text-amber-900 bg-white hover:bg-amber-50 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                <span>وضع السوق</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Four Core Dynamic Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Dynamic Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold text-gray-400 block">الإيرادات المحققة</span>
              <span className="text-xs font-bold text-gray-700">{periodSalesMetrics.label}</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-emerald-500 font-sans">€</span>
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
              {periodSalesMetrics.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Cash vs Card Split Bar */}
          <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-emerald-700 flex items-center gap-1">
                <Banknote className="w-3 h-3" /> كاش: €{periodSalesMetrics.cash.toFixed(0)} ({periodSalesMetrics.cashPct}%)
              </span>
              <span className="text-tasty-teal-dark flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> PIN: €{periodSalesMetrics.card.toFixed(0)} ({periodSalesMetrics.cardPct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden flex">
              <div style={{ width: `${periodSalesMetrics.cashPct}%` }} className="h-full bg-emerald-500 transition-all duration-500" />
              <div style={{ width: `${periodSalesMetrics.cardPct}%` }} className="h-full bg-tasty-teal transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* KPI 2: Labor Cost & Staff Wages */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold text-gray-400 block">تكلفة الكوادر والورديات</span>
              <span className="text-xs font-bold text-gray-700">الأجور المستحقة للفترة</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-blue-500 font-sans">€</span>
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
              {laborStats.totalWages.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <strong>{laborStats.totalHours} ساعة</strong> عمل
            </span>
            <span className="font-bold text-amber-700">
              سلف مسحوبة: €{laborStats.totalAdvances.toFixed(0)}
            </span>
          </div>
        </div>

        {/* KPI 3: Operational Margin / Est. Cash Balance */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold text-gray-400 block">الفائض التشغيلي التقديري</span>
              <span className="text-xs font-bold text-gray-700">(المبيعات - أجور العمل)</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-amber-500 font-sans">€</span>
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
              {operationalGrossMargin.margin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>نسبة أجور العمل من الدخل:</span>
            <span className={`font-bold px-2 py-0.5 rounded-full ${
              operationalGrossMargin.laborRatio > 35 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {operationalGrossMargin.laborRatio}%
            </span>
          </div>
        </div>

        {/* KPI 4: Net Debt & Liquidity Position */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold text-gray-400 block">الموقف المالي للديون</span>
              <span className="text-xs font-bold text-gray-700">صافي التزامات المطعم</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-gray-400 font-sans">€</span>
            <span className={`text-2xl sm:text-3xl font-black font-sans tracking-tight tabular-nums ${
              debtStats.payable.remaining > 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {debtStats.payable.remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-gray-400 mr-1 font-sans">موردين</span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>ديون لنا على الزبائن:</span>
            <span className="font-bold text-blue-700">
              €{debtStats.receivable.remaining.toFixed(2)}
            </span>
          </div>
        </div>

      </div>

      {/* 4. Interactive 7-Day Sales Trend Bar Chart & Liquidity Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-tasty-teal" />
                <h3 className="font-bold text-base text-tasty-charcoal">مخطط حركة المبيعات (الأيام السبعة الأخيرة)</h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">مقارنة حجم مبيعات الأيام لمعرفة ذروة الطلب والإيراد اليومي</p>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" /> كاش
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-tasty-teal" /> كرت PIN
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1 sm:px-4">
            {chartDays.days.map((d, idx) => {
              const heightPct = chartDays.maxVal > 0 ? Math.max(8, Math.round((d.total / chartDays.maxVal) * 100)) : 8;
              const isHighest = d.total > 0 && d.total === chartDays.highestVal;
              const isHovered = hoveredBarIndex === idx;

              return (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-tasty-charcoal text-white text-[11px] py-1.5 px-2.5 rounded-xl shadow-xl whitespace-nowrap animate-fade-in pointer-events-none text-center">
                      <p className="font-bold">€{d.total.toFixed(2)}</p>
                      <p className="text-[9px] text-gray-300">كاش: €{d.cash.toFixed(0)} | كرت: €{d.card.toFixed(0)}</p>
                    </div>
                  )}

                  {/* Highest day badge */}
                  {isHighest && !isHovered && (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded-md mb-1 animate-bounce">
                      الأعلى 🏆
                    </span>
                  )}

                  {/* Value on top of bar */}
                  <span className="text-[10px] font-bold text-gray-400 font-sans mb-1 group-hover:text-tasty-teal tabular-nums">
                    {d.total > 0 ? `€${d.total.toFixed(0)}` : '€0'}
                  </span>

                  {/* Vertical Bar Stack */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[42px] rounded-2xl overflow-hidden flex flex-col justify-end transition-all duration-300 ${
                      d.isToday 
                        ? 'ring-2 ring-emerald-400/80 shadow-md' 
                        : isHovered ? 'scale-105 shadow-md' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    {d.total > 0 ? (
                      <>
                        <div
                          style={{ height: `${d.total > 0 ? (d.card / d.total) * 100 : 0}%` }}
                          className="w-full bg-tasty-teal transition-all"
                        />
                        <div
                          style={{ height: `${d.total > 0 ? (d.cash / d.total) * 100 : 0}%` }}
                          className="w-full bg-emerald-500 transition-all"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 border border-dashed border-gray-300 rounded-xl" />
                    )}
                  </div>

                  {/* Day Label */}
                  <div className="mt-2.5 text-center">
                    <span className={`block text-xs font-bold ${d.isToday ? 'text-emerald-700' : 'text-gray-700'}`}>
                      {d.dayName}
                    </span>
                    <span className="block text-[10px] text-gray-400 font-sans">
                      {d.date.slice(5)}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>متوسط المبيعات اليومي العام: <strong className="text-tasty-teal-dark font-sans">€{salesStats.averageDaily.toFixed(2)}</strong> / يوم</span>
            <Link to="/admin/sales" className="text-tasty-teal hover:underline font-bold flex items-center gap-1">
              <span>عرض سجل المبيعات والتقفيل اليومي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Cash vs PIN Liquidity Breakdown & Advice (1 Col) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <div>
                <h3 className="font-bold text-base text-tasty-charcoal">تحليل وسائل الدفع والسيولة</h3>
                <p className="text-xs text-gray-400">توزيع الأموال بين الدرج والحساب البنكي</p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Cash Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>النقد المتوفر (الكاش)</span>
                  </span>
                  <span className="text-xs font-black font-sans text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                    {periodSalesMetrics.cashPct}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1" dir="ltr">
                  <span className="text-xs font-bold text-emerald-600">€</span>
                  <span className="text-xl font-black font-sans text-emerald-950 tabular-nums">
                    {periodSalesMetrics.cash.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-800/80 mt-1">
                  السيولة النقدية المستلمة في المطعم
                </p>
              </div>

              {/* Card PIN Box */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-tasty-teal-dark flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-tasty-teal" />
                    <span>الدفع الإلكتروني (كرت PIN)</span>
                  </span>
                  <span className="text-xs font-black font-sans text-tasty-teal-dark bg-white px-2 py-0.5 rounded-lg border border-teal-200">
                    {periodSalesMetrics.cardPct}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1" dir="ltr">
                  <span className="text-xs font-bold text-tasty-teal">€</span>
                  <span className="text-xl font-black font-sans text-teal-950 tabular-nums">
                    {periodSalesMetrics.card.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-tasty-teal/80 mt-1">
                  تحويلات مباشرة لحساب بنك المطعم
                </p>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>عدد العمليات المسجلة:</span>
            <strong className="text-tasty-charcoal font-bold">{periodSalesMetrics.count} يومية</strong>
          </div>
        </div>

      </div>

      {/* 5. Live Operations Row: Today's Active Crew & Fast Quick Launchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Active Crew (1 Col) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-tasty-charcoal">كادر العمل لليوم</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {todayShifts.length} مسجل
              </span>
            </div>

            {todayShifts.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-700">لم يُسجل حضور أي موظف لليوم بعد</p>
                <p className="text-[11px] text-gray-400">يمكنك تسجيل الورديات بضغطة زر واحدة</p>
                <Link
                  to="/admin/employees"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>تحضير الكادر الآن</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {todayShifts.map((s) => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                        {s.employeeName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">{s.employeeName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{s.startTime} - {s.endTime}</span>
                      </div>
                    </div>
                    <div className="text-left font-mono font-bold text-xs text-emerald-700">
                      <span>{s.totalHours}س</span>
                      <span className="text-[10px] text-gray-400 block">€{s.totalEarned.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400">إجمالي عمالة اليوم:</span>
            <strong className="text-gray-800 font-bold">
              €{todayShifts.reduce((acc, s) => acc + s.totalEarned, 0).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Quick Operational Launchers (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-tasty-charcoal">الوصول السريع للأقسام الإدارية</h3>
              <span className="text-xs text-gray-400">روابط سريعة لكافة العمليات</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/admin/sales"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-tasty-bg-warm hover:bg-emerald-50 border border-gray-200/80 hover:border-emerald-300 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-tasty-charcoal">مبيعات اليوم</p>
                <p className="text-[10px] text-gray-400 mt-0.5">تقفيل الكاش والكرت</p>
              </Link>

              <Link
                to="/admin/employees"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-tasty-bg-warm hover:bg-blue-50 border border-gray-200/80 hover:border-blue-300 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-tasty-charcoal">الموظفون والورديات</p>
                <p className="text-[10px] text-gray-400 mt-0.5">ساعات وسلف الشباب</p>
              </Link>

              <Link
                to="/admin/orders"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-tasty-bg-warm hover:bg-amber-50 border border-gray-200/80 hover:border-amber-300 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-tasty-charcoal">طلبيات الشراء</p>
                <p className="text-[10px] text-gray-400 mt-0.5">مواد ومشتريات السوق</p>
              </Link>

              <Link
                to="/admin/debts"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-tasty-bg-warm hover:bg-purple-50 border border-gray-200/80 hover:border-purple-300 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
                  <Scale className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-tasty-charcoal">سجل الديون</p>
                <p className="text-[10px] text-gray-400 mt-0.5">الموردون والزبائن</p>
              </Link>
            </div>
          </div>

          {/* Quick Shopping launcher button if order exists */}
          {activeOrderToShop && (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">طلبية جاهزة للتسوق: <strong>{activeOrderToShop.title}</strong></span>
              <button
                onClick={() => setActiveShoppingOrder(activeOrderToShop)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>فتح وضع الشراء في السوق</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 6. Two Column Grid: Recent Sales Entries & Active Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Daily Sales Log */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-tasty-charcoal">آخر إدخالات المبيعات</h3>
              <p className="text-xs text-gray-400">تقفيل اليوميات الأخيرة والنسب المئوية</p>
            </div>
            <Link
              to="/admin/sales"
              className="text-xs font-bold text-tasty-teal hover:text-tasty-teal-dark flex items-center gap-1"
            >
              <span>عرض السجل</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSales.slice(0, 4).map((sale) => (
              <div
                key={sale.id}
                className="p-3.5 rounded-2xl bg-tasty-bg-warm border border-gray-100 flex items-center justify-between gap-3 hover:border-gray-200 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-tasty-charcoal">{sale.date}</span>
                    {sale.date === todayStr && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        اليوم
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 font-mono">
                    <span>كاش: €{sale.cashAmount.toFixed(0)} ({sale.cashPercentage}%)</span>
                    <span>•</span>
                    <span>كرت: €{sale.cardAmount.toFixed(0)} ({sale.cardPercentage}%)</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="flex items-baseline gap-0.5 font-sans font-black text-sm sm:text-base text-tasty-charcoal tabular-nums" dir="ltr">
                    <span className="text-xs font-bold text-gray-400">€</span>
                    <span>{sale.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders in Pipeline */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-tasty-charcoal">طلبيات بضاعة المطعم</h3>
              <p className="text-xs text-gray-400">متابعة شراء المواد الاستهلاكية والتجهيز</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-tasty-teal hover:text-tasty-teal-dark flex items-center gap-1"
            >
              <span>إدارة الطلبيات</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => {
              const total = order.items.length;
              const done = order.items.filter((i) => i.isPurchased).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const isCompleted = order.status === 'completed';

              return (
                <div
                  key={order.id}
                  className="p-3.5 rounded-2xl bg-tasty-bg-warm border border-gray-100 flex items-center justify-between gap-3 hover:border-gray-200 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-tasty-charcoal truncate">
                        {order.title}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isCompleted ? 'مكتملة' : 'قيد الشراء'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {done} من {total} مواد تم شراؤها ({pct}%) • {order.date}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveShoppingOrder(order)}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-tasty-teal hover:text-white border border-gray-200 text-xs font-bold text-tasty-teal-dark transition-all"
                  >
                    فتح القائمة
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Shopping Mode Modal */}
      <ShoppingModeModal
        order={activeShoppingOrder}
        isOpen={!!activeShoppingOrder}
        onClose={() => setActiveShoppingOrder(null)}
        onOrderUpdated={(updated) => {
          setActiveShoppingOrder(updated);
          reloadData();
        }}
      />

    </div>
  );
};

