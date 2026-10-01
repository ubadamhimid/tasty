import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import { PurchaseOrder, DailySalesRecord } from '../types';
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
  Sparkles
} from 'lucide-react';

export const AdminDashboardHome: React.FC = () => {
  const [salesStats, setSalesStats] = useState(StorageService.getSalesStats());
  const [debtStats, setDebtStats] = useState(StorageService.getDebtStats());
  const [orders, setOrders] = useState<PurchaseOrder[]>(StorageService.getPurchaseOrders());
  const [recentSales, setRecentSales] = useState<DailySalesRecord[]>(StorageService.getDailySales());
  const [activeShoppingOrder, setActiveShoppingOrder] = useState<PurchaseOrder | null>(null);

  const reloadData = () => {
    setSalesStats(StorageService.getSalesStats());
    setDebtStats(StorageService.getDebtStats());
    setOrders(StorageService.getPurchaseOrders());
    setRecentSales(StorageService.getDailySales());
  };

  useEffect(() => {
    return StorageService.subscribe(reloadData);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySale = recentSales.find((s) => s.date === todayStr);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrderToShop = pendingOrders.length > 0 ? pendingOrders[0] : (orders[0] || null);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-tasty-charcoal via-tasty-teal-dark to-tasty-teal rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                لوحة العمليات اليومية
              </span>
              <span className="text-xs text-tasty-sage-light">
                {new Date().toLocaleDateString('ar-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-white">
              أهلاً بك في نظام إدارة TASTY
            </h1>
            <p className="text-xs sm:text-sm text-tasty-sage-light/90 max-w-xl mt-1">
              متابعة مبيعات الكاش والكرت، تجهيز طلبيات الشراء بالجملة، وإدارة حسابات الموردين والزبائن.
            </p>
          </div>

          {/* Quick Shopping Mode Launch */}
          {activeOrderToShop && (
            <button
              onClick={() => setActiveShoppingOrder(activeOrderToShop)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-tasty-bg text-tasty-teal-dark font-bold text-sm shadow-md active:scale-95 transition-all shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-tasty-terracotta" />
              <span>بدء وضع الشراء في السوق</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Today's Sales */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">مبيعات اليوم (€)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-serif font-black text-tasty-charcoal">
              €{todaySale ? todaySale.totalAmount.toLocaleString('nl-NL') : '0.00'}
            </span>
          </div>
          {todaySale ? (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Banknote className="w-3 h-3 text-emerald-600" /> كاش: €{todaySale.cashAmount}
                </span>
                <span className="font-bold text-emerald-700">{todaySale.cashPercentage}%</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-tasty-teal" /> كرت PIN: €{todaySale.cardAmount}
                </span>
                <span className="font-bold text-tasty-teal-dark">{todaySale.cardPercentage}%</span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs text-amber-600 font-medium">لم يتم إدخال مبيعات اليوم بعد</p>
          )}
        </div>

        {/* KPI 2: Active Purchase Orders */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">طلبيات الشراء النشطة</span>
            <div className="w-9 h-9 rounded-xl bg-tasty-teal-light text-tasty-teal flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-black text-tasty-charcoal">
              {pendingOrders.length}
            </span>
            <span className="text-xs text-gray-400 font-medium">طلبية قيد الشراء</span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>إجمالي المواد المطلوبة:</span>
            <span className="font-bold text-tasty-charcoal">
              {pendingOrders.reduce((sum, o) => sum + o.items.filter((i) => !i.isPurchased).length, 0)} مادة
            </span>
          </div>
        </div>

        {/* KPI 3: Payables (ديون علينا للموردين) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">ديون علينا للموردين</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-serif font-black text-red-600">
              €{debtStats.payable.remaining.toLocaleString('nl-NL')}
            </span>
            <span className="text-xs text-gray-400">متبقي</span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>تم سداده: €{debtStats.payable.paid}</span>
            <span className="font-bold text-gray-500">من أصل €{debtStats.payable.total}</span>
          </div>
        </div>

        {/* KPI 4: Receivables (ديون لنا على الزبائن) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">ديون لنا على الزبائن</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-serif font-black text-blue-600">
              €{debtStats.receivable.remaining.toLocaleString('nl-NL')}
            </span>
            <span className="text-xs text-gray-400">متبقي للتحصيل</span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>تم تحصيله: €{debtStats.receivable.paid}</span>
            <span className="font-bold text-gray-500">من أصل €{debtStats.receivable.total}</span>
          </div>
        </div>

      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/sales"
            className="flex items-center gap-3 p-3 rounded-2xl bg-tasty-bg-warm hover:bg-tasty-teal-light/40 border border-tasty-teal/15 transition-all text-right group"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-tasty-teal flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-tasty-charcoal">تسجيل مبيعات اليوم</p>
              <p className="text-[10px] text-gray-500">كاش vs شبكة</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-3 rounded-2xl bg-tasty-bg-warm hover:bg-tasty-terracotta-light/50 border border-tasty-terracotta/20 transition-all text-right group"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-tasty-terracotta flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-tasty-charcoal">إنشاء طلبية شراء</p>
              <p className="text-[10px] text-gray-500">اختيار من الكتالوج</p>
            </div>
          </Link>

          {activeOrderToShop && (
            <button
              onClick={() => setActiveShoppingOrder(activeOrderToShop)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition-all text-right group"
            >
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">وضع الشراء</p>
                <p className="text-[10px] text-emerald-700">شطب المواد في السوق</p>
              </div>
            </button>
          )}

          <Link
            to="/admin/debts"
            className="flex items-center gap-3 p-3 rounded-2xl bg-tasty-bg-warm hover:bg-purple-50 border border-purple-200/40 transition-all text-right group"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-tasty-charcoal">سجل الديون</p>
              <p className="text-[10px] text-gray-500">إضافة قيد أو سداد</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Grid: Recent Sales & Active Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Daily Sales */}
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
                className="p-3.5 rounded-2xl bg-tasty-bg-warm border border-gray-100 flex items-center justify-between gap-3"
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
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>كاش: €{sale.cashAmount} ({sale.cashPercentage}%)</span>
                    <span>•</span>
                    <span>كرت: €{sale.cardAmount} ({sale.cardPercentage}%)</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="font-serif font-black text-sm sm:text-base text-tasty-charcoal">
                    €{sale.totalAmount}
                  </span>
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
                  className="p-3.5 rounded-2xl bg-tasty-bg-warm border border-gray-100 flex items-center justify-between gap-3"
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
