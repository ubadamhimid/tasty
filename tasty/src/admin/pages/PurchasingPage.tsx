import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { MasterItem, PurchaseOrder, OrderItem, ItemCategory, ItemUnit } from '../types';
import { ShoppingModeModal } from '../components/ShoppingModeModal';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Check,
  ChevronLeft,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

const CATEGORIES: { key: ItemCategory; label: string }[] = [
  { key: 'meat', label: 'لحوم ودواجن' },
  { key: 'vegetables', label: 'خضار وفواكه' },
  { key: 'bread', label: 'مخبوزات وخبز' },
  { key: 'dairy_sauces', label: 'أجبان وصوصات' },
  { key: 'dry_goods', label: 'مواد جافة وبقوليات' },
  { key: 'packaging', label: 'تغليف وعلب' },
  { key: 'drinks', label: 'مشروبات وعصائر' },
  { key: 'other', label: 'أخرى' },
];

const UNITS: { key: ItemUnit; label: string }[] = [
  { key: 'kg', label: 'كيلو (kg)' },
  { key: 'box', label: 'كرتونة (Box)' },
  { key: 'bag', label: 'كيس (Bag)' },
  { key: 'pack', label: 'باكيت / علبة' },
  { key: 'piece', label: 'حبة / قطعة' },
  { key: 'liter', label: 'لتر (Liter)' },
];

export const PurchasingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'new_order' | 'catalog'>('orders');
  const [masterItems, setMasterItems] = useState<MasterItem[]>(StorageService.getMasterItems());
  const [orders, setOrders] = useState<PurchaseOrder[]>(StorageService.getPurchaseOrders());
  const [shoppingOrder, setShoppingOrder] = useState<PurchaseOrder | null>(null);

  // New Order Form state
  const [orderTitle, setOrderTitle] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, { quantity: number; notes: string }>>({});
  const [orderSearch, setOrderSearch] = useState('');
  const [orderCategoryFilter, setOrderCategoryFilter] = useState<string>('all');

  // Master Items Catalog state
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('all');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);
  const [itemForm, setItemForm] = useState<{
    name: string;
    category: ItemCategory;
    unit: ItemUnit;
    defaultQty: number;
    notes: string;
  }>({
    name: '',
    category: 'meat',
    unit: 'kg',
    defaultQty: 10,
    notes: '',
  });

  const reloadData = () => {
    setMasterItems(StorageService.getMasterItems());
    setOrders(StorageService.getPurchaseOrders());
  };

  useEffect(() => {
    return StorageService.subscribe(reloadData);
  }, []);

  // --------------------------------------------------------------------------
  // New Order Creation Handlers
  // --------------------------------------------------------------------------
  const toggleItemSelection = (masterItem: MasterItem) => {
    setSelectedItemsMap((prev) => {
      const copy = { ...prev };
      if (copy[masterItem.id]) {
        delete copy[masterItem.id];
      } else {
        copy[masterItem.id] = {
          quantity: masterItem.defaultQty || 5,
          notes: masterItem.notes || '',
        };
      }
      return copy;
    });
  };

  const updateSelectedQty = (id: string, qty: number) => {
    setSelectedItemsMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: Math.max(0.5, qty),
      },
    }));
  };

  const updateSelectedNote = (id: string, notes: string) => {
    setSelectedItemsMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes,
      },
    }));
  };

  const handleCreateOrder = (launchShoppingMode = false) => {
    const selectedIds = Object.keys(selectedItemsMap);
    if (selectedIds.length === 0) {
      alert('يرجى اختيار مادة واحدة على الأقل من الكتالوج لإنشاء الطلبية');
      return;
    }

    const items: OrderItem[] = selectedIds.map((id) => {
      const master = masterItems.find((m) => m.id === id)!;
      const details = selectedItemsMap[id];
      return {
        id: `poi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        masterItemId: master.id,
        name: master.name,
        category: master.category,
        unit: master.unit,
        quantity: details.quantity,
        notes: details.notes,
        isPurchased: false,
      };
    });

    const newOrder = StorageService.savePurchaseOrder({
      title: orderTitle.trim() || `طلبية تسوق (${orderDate})`,
      date: orderDate,
      notes: orderNotes.trim(),
      items,
      status: 'pending',
    });

    // Reset Form
    setOrderTitle('');
    setSelectedItemsMap({});
    setOrderNotes('');

    if (launchShoppingMode) {
      setShoppingOrder(newOrder);
      setActiveTab('orders');
    } else {
      setActiveTab('orders');
    }
  };

  // --------------------------------------------------------------------------
  // Catalog Management Handlers
  // --------------------------------------------------------------------------
  const openAddItemModal = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      category: 'meat',
      unit: 'kg',
      defaultQty: 10,
      notes: '',
    });
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: MasterItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      defaultQty: item.defaultQty || 1,
      notes: item.notes || '',
    });
    setIsItemModalOpen(true);
  };

  const handleSaveMasterItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim()) return;

    StorageService.saveMasterItem({
      ...(editingItem ? { id: editingItem.id } : {}),
      name: itemForm.name.trim(),
      category: itemForm.category,
      unit: itemForm.unit,
      defaultQty: Number(itemForm.defaultQty) || 1,
      notes: itemForm.notes.trim(),
      isActive: true,
    });

    setIsItemModalOpen(false);
  };

  const handleDeleteMasterItem = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المادة من الكتالوج؟')) {
      StorageService.deleteMasterItem(id);
    }
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('هل تود حذف هذه الطلبية من الأرشيف؟')) {
      StorageService.deletePurchaseOrder(id);
    }
  };

  // Filter Catalog
  const filteredCatalog = masterItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchCat = catalogCategoryFilter === 'all' || item.category === catalogCategoryFilter;
    return matchSearch && matchCat;
  });

  // Filter Catalog inside New Order screen
  const filteredNewOrderItems = masterItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(orderSearch.toLowerCase());
    const matchCat = orderCategoryFilter === 'all' || item.category === orderCategoryFilter;
    return matchSearch && matchCat;
  });

  const selectedCount = Object.keys(selectedItemsMap).length;

  return (
    <div className="space-y-6">
      
      {/* Header and Top Tabs */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark">
              المشتريات والتوريد
            </span>
          </div>
          <h1 className="font-serif font-black text-xl sm:text-2xl text-tasty-charcoal">
            إدارة وتجهيز طلبيات بضاعة المطعم
          </h1>
          <p className="text-xs text-gray-500">
            تجهيز قوائم السوق، وضع التسوق الميداني للموبايل، وأرشيف المشتريات الأسبوعية.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-tasty-bg-warm p-1.5 rounded-2xl border border-gray-200 shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-tasty-teal text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            الطلبيات النشطة والأرشيف ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('new_order')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'new_order'
                ? 'bg-tasty-terracotta text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>طلب جديد {selectedCount > 0 ? `(${selectedCount})` : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'catalog'
                ? 'bg-tasty-charcoal text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            كتالوج المواد ({masterItems.length})
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TAB 1: ORDERS LIST & ARCHIVE */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700">قائمة طلبيات الشراء</h2>
            <button
              onClick={() => setActiveTab('new_order')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-tasty-teal text-white rounded-xl text-xs font-bold hover:bg-tasty-teal-dark transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إنشاء قائمة شراء جديدة</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-gray-700">لا توجد طلبيات شراء حتى الآن</h3>
              <p className="text-xs text-gray-400 mt-1 mb-4">ابدأ بإنشاء أول قائمة شراء لتسوق بضاعة الأسبوع</p>
              <button
                onClick={() => setActiveTab('new_order')}
                className="px-4 py-2 bg-tasty-teal text-white rounded-xl text-xs font-bold"
              >
                إنشاء طلبية الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((order) => {
                const total = order.items.length;
                const completed = order.items.filter((i) => i.isPurchased).length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                const isCompleted = order.status === 'completed';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-3xl p-5 border transition-all ${
                      isCompleted ? 'border-gray-100 opacity-90' : 'border-tasty-teal/30 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-400">{order.orderNumber}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isCompleted ? 'مكتملة' : 'قيد الشراء والتسوق'}
                          </span>
                        </div>
                        <h3 className="font-cairo font-bold text-base text-tasty-charcoal mt-1">
                          {order.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">التاريخ: {order.date}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                        title="حذف الطلبية"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {order.notes && (
                      <p className="text-xs text-gray-600 bg-tasty-bg-warm p-2.5 rounded-xl mb-3">
                        💬 {order.notes}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-500">
                          {completed} من {total} مواد تم شراؤها
                        </span>
                        <span className="text-tasty-teal font-mono">{pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-tasty-teal'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setShoppingOrder(order)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-tasty-teal to-tasty-teal-dark hover:from-tasty-teal-dark hover:to-tasty-teal text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-4 h-4 text-tasty-terracotta" />
                        <span>فتح وضع الشراء في السوق</span>
                      </button>

                      <button
                        onClick={() => {
                          // Quick clone or edit
                          setOrderTitle(`نسخة من ${order.title}`);
                          const map: Record<string, { quantity: number; notes: string }> = {};
                          order.items.forEach((item) => {
                            map[item.masterItemId] = {
                              quantity: item.quantity,
                              notes: item.notes || '',
                            };
                          });
                          setSelectedItemsMap(map);
                          setActiveTab('new_order');
                        }}
                        className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                        title="تكرار الطلبية لإنشاء جديدة بنفس المواد"
                      >
                        نسخ كجديدة
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: CREATE NEW PURCHASE ORDER */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'new_order' && (
        <div className="space-y-6">
          {/* Order Details Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
            <h2 className="font-cairo font-bold text-base text-tasty-charcoal">معلومات قائمة الشراء الجديدة</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الطلبية</label>
                <input
                  type="text"
                  placeholder="مثال: طلبية خضار ولحوم نهاية الأسبوع"
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الطلبية</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظات عامة</label>
                <input
                  type="text"
                  placeholder="مثال: طلب توصيل قبل الساعة 11 صباحاً"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>
            </div>
          </div>

          {/* Master Item Selection from Catalog */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-cairo font-bold text-base text-tasty-charcoal">
                  اختر المواد من الكتالوج ({selectedCount} مادة محددة)
                </h3>
                <p className="text-xs text-gray-400">انقر على المادة لتحديدها وتعديل الكمية المطلوبة</p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="بحث سريع..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pr-9 pl-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal w-40 sm:w-52"
                  />
                </div>

                <select
                  value={orderCategoryFilter}
                  onChange={(e) => setOrderCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                >
                  <option value="all">كافة الفئات</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto p-1">
              {filteredNewOrderItems.map((item) => {
                const isSelected = !!selectedItemsMap[item.id];
                const selectedData = selectedItemsMap[item.id];
                const catLabel = CATEGORIES.find((c) => c.key === item.category)?.label || item.category;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-tasty-teal-light/40 border-tasty-teal shadow-xs'
                        : 'bg-white hover:bg-tasty-bg-warm border-gray-200'
                    }`}
                  >
                    <div
                      onClick={() => toggleItemSelection(item)}
                      className="cursor-pointer flex items-center justify-between gap-2 select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-tasty-teal text-white'
                              : 'border-2 border-gray-300 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-cairo font-bold text-xs sm:text-sm text-tasty-charcoal truncate">
                            {item.name}
                          </p>
                          <span className="text-[10px] text-gray-400">{catLabel}</span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 shrink-0">
                        {item.unit}
                      </span>
                    </div>

                    {/* Quantity & Notes input if selected */}
                    {isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-tasty-teal/20 grid grid-cols-2 gap-2 animate-fade-in">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">الكمية:</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0.5}
                              step={0.5}
                              value={selectedData.quantity}
                              onChange={(e) => updateSelectedQty(item.id, parseFloat(e.target.value))}
                              className="w-full px-2 py-1 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white font-mono font-bold"
                            />
                            <span className="text-[10px] text-gray-500">{item.unit}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">ملاحظة:</label>
                          <input
                            type="text"
                            placeholder="مواصفات..."
                            value={selectedData.notes}
                            onChange={(e) => updateSelectedNote(item.id, e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs font-medium text-gray-500">
                المجموع المختار: <strong className="text-tasty-teal font-bold">{selectedCount}</strong> مواد
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCreateOrder(false)}
                  disabled={selectedCount === 0}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-tasty-teal text-tasty-teal-dark font-bold text-xs hover:bg-tasty-teal-light transition-all disabled:opacity-40"
                >
                  حفظ في الأرشيف
                </button>

                <button
                  onClick={() => handleCreateOrder(true)}
                  disabled={selectedCount === 0}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold text-xs shadow-md shadow-tasty-teal/20 transition-all disabled:opacity-40 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-tasty-terracotta" />
                  <span>حفظ وبدء وضع الشراء فوراً</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: MASTER ITEMS CATALOG */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-cairo font-bold text-base text-tasty-charcoal">كتالوج المواد الأساسية</h2>
              <p className="text-xs text-gray-400">تعريف وتعديل كافة المواد والوحدات التي يتم شراؤها دورياً للمطعم</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openAddItemModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-tasty-teal text-white rounded-xl text-xs font-bold hover:bg-tasty-teal-dark transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مادة جديدة</span>
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو التوصيف..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setCatalogCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  catalogCategoryFilter === 'all'
                    ? 'bg-tasty-charcoal text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                الكل ({masterItems.length})
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCatalogCategoryFilter(c.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    catalogCategoryFilter === c.key
                      ? 'bg-tasty-teal text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Items Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-tasty-bg-warm border-b border-gray-100 text-gray-500 font-bold">
                    <th className="p-3.5">اسم المادة</th>
                    <th className="p-3.5">الفئة</th>
                    <th className="p-3.5">وحدة القياس</th>
                    <th className="p-3.5">الكمية الافتراضية</th>
                    <th className="p-3.5">ملاحظات ومواصفات</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCatalog.map((item) => {
                    const catLabel = CATEGORIES.find((c) => c.key === item.category)?.label || item.category;
                    const unitLabel = UNITS.find((u) => u.key === item.unit)?.label || item.unit;

                    return (
                      <tr key={item.id} className="hover:bg-tasty-bg-warm/60 transition-colors">
                        <td className="p-3.5 font-cairo font-bold text-tasty-charcoal">
                          {item.name}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
                            {catLabel}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-gray-600">
                          {unitLabel}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-tasty-teal-dark">
                          {item.defaultQty || 1}
                        </td>
                        <td className="p-3.5 text-gray-500 max-w-xs truncate">
                          {item.notes || '—'}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditItemModal(item)}
                              className="p-1.5 text-gray-400 hover:text-tasty-teal rounded-lg hover:bg-tasty-teal-light transition-colors"
                              title="تعديل المادة"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMasterItem(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="حذف المادة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* ADD / EDIT MASTER ITEM MODAL */}
      {/* -------------------------------------------------------------------- */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" dir="rtl">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
            <h3 className="font-cairo font-bold text-base text-tasty-charcoal mb-4">
              {editingItem ? 'تعديل مادة في الكتالوج' : 'إضافة مادة جديدة إلى الكتالوج'}
            </h3>

            <form onSubmit={handleSaveMasterItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اسم المادة</label>
                <input
                  type="text"
                  placeholder="مثال: شاورما دجاج متبلة، خبز صاج..."
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">التصنيف</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as ItemCategory })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">وحدة القياس</label>
                  <select
                    value={itemForm.unit}
                    onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value as ItemUnit })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                  >
                    {UNITS.map((u) => (
                      <option key={u.key} value={u.key}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الكمية الافتراضية للطلب</label>
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={itemForm.defaultQty}
                  onChange={(e) => setItemForm({ ...itemForm, defaultQty: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظات ومواصفات المادة</label>
                <textarea
                  rows={2}
                  placeholder="مثال: نوع محدد، ماركة مفضلة، حجم الحبة..."
                  value={itemForm.notes}
                  onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white text-xs font-bold shadow-xs"
                >
                  حفظ المادة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shopping Mode Modal Component */}
      <ShoppingModeModal
        order={shoppingOrder}
        isOpen={!!shoppingOrder}
        onClose={() => setShoppingOrder(null)}
        onOrderUpdated={(updated) => {
          setShoppingOrder(updated);
          reloadData();
        }}
      />

    </div>
  );
};
