import React, { useState } from 'react';
import { PurchaseOrder, OrderItem, ItemCategory, ItemUnit } from '../types';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  X,
  Plus,
  Share2,
  Sparkles,
  ShoppingBag,
  Search,
  Filter,
  CheckCheck,
  RotateCcw
} from 'lucide-react';

interface ShoppingModeModalProps {
  order: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: (order: PurchaseOrder) => void;
}

const CATEGORY_NAMES: Record<ItemCategory | string, string> = {
  meat: 'لحوم ودواجن',
  vegetables: 'خضار وفواكه',
  bread: 'مخبوزات وخبز',
  dry_goods: 'مواد جافة وتوابل',
  dairy_sauces: 'أجبان وصوصات',
  packaging: 'تغليف وعلب',
  drinks: 'مشروبات',
  other: 'أخرى',
};

const UNIT_NAMES: Record<ItemUnit | string, string> = {
  kg: 'كغ',
  box: 'كرتونة',
  bag: 'كيس',
  pack: 'باكيت',
  piece: 'قطعة',
  liter: 'لتر',
};

export const ShoppingModeModal: React.FC<ShoppingModeModalProps> = ({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}) => {
  if (!isOpen || !order) return null;

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'remaining' | 'done'>('all');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickQty, setQuickQty] = useState<number>(1);
  const [quickUnit, setQuickUnit] = useState<ItemUnit>('kg');
  const [quickCategory, setQuickCategory] = useState<ItemCategory>('vegetables');

  const totalItems = order.items.length;
  const completedItems = order.items.filter((i) => i.isPurchased).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const isAllDone = totalItems > 0 && completedItems === totalItems;

  const handleToggle = (itemId: string) => {
    const updated = StorageService.toggleOrderItemPurchased(order.id, itemId);
    if (updated) {
      onOrderUpdated?.(updated);

      // Check if this action made it 100%
      const newDone = updated.items.filter((i) => i.isPurchased).length;
      if (newDone === updated.items.length && updated.items.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5E9895', '#E29578', '#9DBEBB', '#FAF7F2'],
        });
      }
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const newItem: OrderItem = {
      id: `poi-${Date.now()}`,
      masterItemId: `quick-${Date.now()}`,
      name: quickName.trim(),
      category: quickCategory,
      unit: quickUnit,
      quantity: Number(quickQty) || 1,
      isPurchased: false,
    };

    const updatedOrder: PurchaseOrder = {
      ...order,
      items: [newItem, ...order.items],
      status: 'pending',
    };

    StorageService.savePurchaseOrder(updatedOrder);
    onOrderUpdated?.(updatedOrder);
    setQuickName('');
    setShowQuickAdd(false);
  };

  const handleShareWhatsApp = () => {
    let text = `🛒 *قائمة تسوق مطعم TASTY*\n`;
    text += `📋 *${order.title}* (${order.date})\n`;
    text += `---------------------------------\n`;

    order.items.forEach((item, idx) => {
      const statusIcon = item.isPurchased ? '✅' : '⬜';
      const unit = UNIT_NAMES[item.unit] || item.unit;
      text += `${idx + 1}. ${statusIcon} ${item.name} (${item.quantity} ${unit})\n`;
      if (item.notes) text += `   💬 ملاحظة: ${item.notes}\n`;
    });

    text += `---------------------------------\n`;
    text += `📊 المجموع: ${completedItems}/${totalItems} تم شراؤها (${progressPercent}%)\n`;
    text += `📍 TASTY Hilversum - Leeuwenstraat 14`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const filteredItems = order.items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'remaining') return !item.isPurchased;
    if (filter === 'done') return item.isPurchased;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-tasty-bg md:bg-black/60 md:backdrop-blur-sm md:items-center md:justify-center p-0 md:p-4" dir="rtl">
      <div className="flex flex-col w-full h-full md:max-w-2xl md:h-[90vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden border border-tasty-teal/20">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-tasty-charcoal via-tasty-teal-dark to-tasty-teal text-white p-4 sm:p-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-tasty-terracotta border border-white/10">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 text-white">
                    وضع الشراء الميداني
                  </span>
                  <span className="text-xs text-tasty-sage-light/80">{order.date}</span>
                </div>
                <h2 className="font-cairo font-bold text-base sm:text-lg leading-tight mt-0.5 truncate max-w-[220px] sm:max-w-md">
                  {order.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShareWhatsApp}
                title="مشاركة عبر واتساب"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar & Counter */}
          <div className="mt-4 pt-3 border-t border-white/15">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                {isAllDone ? (
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    اكتملت جميع بنود الطلبية بنجاح!
                  </span>
                ) : (
                  <span>تم شراء: <strong className="text-white font-bold">{completedItems}</strong> من أصل {totalItems}</span>
                )}
              </span>
              <span className="font-mono font-bold text-tasty-sage-light text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isAllDone ? 'bg-emerald-400' : 'bg-gradient-to-r from-tasty-terracotta to-tasty-sage'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="p-3 sm:p-4 bg-tasty-bg-warm border-b border-gray-100 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between shrink-0">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث في مواد الطلبية..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'all' ? 'bg-tasty-teal text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              الكل ({totalItems})
            </button>
            <button
              onClick={() => setFilter('remaining')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'remaining' ? 'bg-tasty-terracotta text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              المتبقي ({totalItems - completedItems})
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'done' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              تم ({completedItems})
            </button>
          </div>
        </div>

        {/* Quick Add Toggle Form */}
        {showQuickAdd ? (
          <form onSubmit={handleQuickAdd} className="p-3 bg-tasty-teal-light/40 border-b border-tasty-teal/20 animate-fade-in shrink-0">
            <div className="text-xs font-bold text-tasty-teal-dark mb-2 flex items-center justify-between">
              <span>إضافة مادة عاجلة أثناء التسوق:</span>
              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                إلغاء
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="اسم المادة (مثال: بهار كمون، كيس فحم...)"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="sm:col-span-2 px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                required
                autoFocus
              />
              <div className="flex gap-1.5 sm:col-span-2">
                <input
                  type="number"
                  placeholder="الكمية"
                  value={quickQty}
                  min={0.5}
                  step={0.5}
                  onChange={(e) => setQuickQty(parseFloat(e.target.value))}
                  className="w-20 px-2 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
                <select
                  value={quickUnit}
                  onChange={(e) => setQuickUnit(e.target.value as ItemUnit)}
                  className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                >
                  <option value="kg">كيلو</option>
                  <option value="box">كرتونة</option>
                  <option value="bag">كيس</option>
                  <option value="pack">علبة/باكيت</option>
                  <option value="piece">حبة/قطعة</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-tasty-teal text-white rounded-lg text-xs font-bold hover:bg-tasty-teal-dark whitespace-nowrap"
                >
                  إضافة
                </button>
              </div>
            </div>
          </form>
        ) : null}

        {/* Scrollable Item Checklist - Large Touch Targets */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">لا توجد مواد مطابقة للفلتر المحدد</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isChecked = item.isPurchased;
              const unitLabel = UNIT_NAMES[item.unit] || item.unit;
              const catLabel = CATEGORY_NAMES[item.category] || item.category;

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  role="button"
                  tabIndex={0}
                  className={`w-full text-right p-3.5 sm:p-4 rounded-2xl border transition-all select-none flex items-center justify-between gap-3 cursor-pointer active:scale-[0.98] ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-200 text-gray-400'
                      : 'bg-white hover:bg-tasty-bg-warm border-gray-200 shadow-sm text-tasty-charcoal hover:border-tasty-teal/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Big Checkbox */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-gray-300 text-transparent hover:border-tasty-teal'
                      }`}
                    >
                      <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-cairo font-bold text-sm sm:text-base leading-snug ${
                            isChecked ? 'line-through text-gray-400' : 'text-tasty-charcoal'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {catLabel}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-tasty-terracotta-dark mt-0.5 truncate">
                          💬 {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Pill */}
                  <div className="shrink-0 text-left">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-bold text-sm sm:text-base px-3 py-1 rounded-xl ${
                        isChecked
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/20'
                      }`}
                    >
                      {item.quantity} <span className="text-xs font-sans font-medium">{unitLabel}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Bar: Quick Add Trigger + Complete Order */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-2 shrink-0">
          {!showQuickAdd && (
            <button
              onClick={() => setShowQuickAdd(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-tasty-teal hover:bg-tasty-teal-light/20 text-tasty-charcoal text-xs sm:text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4 text-tasty-teal" />
              <span>إضافة مادة سريعة</span>
            </button>
          )}

          <div className="flex items-center gap-2 mr-auto">
            {order.status === 'completed' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                الطلبية مكتملة ومغلقة
              </span>
            ) : (
              <button
                onClick={() => {
                  const updated: PurchaseOrder = {
                    ...order,
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                  };
                  StorageService.savePurchaseOrder(updated);
                  onOrderUpdated?.(updated);
                  confetti();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد إتمام الطلبية</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
