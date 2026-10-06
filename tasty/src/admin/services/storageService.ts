import {
  MasterItem,
  PurchaseOrder,
  DailySalesRecord,
  DebtRecord,
  DebtPayment,
  AdminBackupData,
  ItemCategory,
  ItemUnit,
  Employee,
  EmployeeShift,
  EmployeeAdvance,
  EmployeePaymentMethod,
  EmployeePaymentType,
  WageType,
  ShiftPaymentStatus
} from '../types';

const STORAGE_KEYS = {
  MASTER_ITEMS: 'tasty_admin_master_items_v2',
  PURCHASE_ORDERS: 'tasty_admin_purchase_orders_v2',
  DAILY_SALES: 'tasty_admin_daily_sales_v2',
  DEBTS: 'tasty_admin_debts_v2',
  EMPLOYEES: 'tasty_admin_employees_v1',
  EMPLOYEE_SHIFTS: 'tasty_admin_employee_shifts_v1',
  EMPLOYEE_ADVANCES: 'tasty_admin_employee_advances_v1',
  EVENT_NAME: 'tasty_storage_changed',
};

// Cleanup legacy v1 mock keys from user storage
try {
  localStorage.removeItem('tasty_admin_daily_sales_v1');
  localStorage.removeItem('tasty_admin_debts_v1');
  localStorage.removeItem('tasty_admin_purchase_orders_v1');
} catch (e) {}

// Helper: Notify subscribers across the app & trigger server sync
function notifySubscribers(triggerSync = true) {
  window.dispatchEvent(new Event(STORAGE_KEYS.EVENT_NAME));
  if (triggerSync && typeof StorageService !== 'undefined' && StorageService.triggerBackgroundSync) {
    StorageService.triggerBackgroundSync();
  }
}

// -------------------------------------------------------------
// Seed / Initial Data
// -------------------------------------------------------------
const INITIAL_MASTER_ITEMS: MasterItem[] = [
  {
    id: 'mi-1',
    name: 'شاورما دجاج متبلة (جاهزة للشيش)',
    category: 'meat',
    unit: 'kg',
    defaultQty: 40,
    notes: 'تتبيلة المستودع المركزية رقم 1',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-2',
    name: 'لحم عجل طازج شاورما',
    category: 'meat',
    unit: 'kg',
    defaultQty: 30,
    notes: 'قطع رقيقة متبلة بدون دهن زائد',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-3',
    name: 'لحم مفروم ناعم للمناقيش والصفائح',
    category: 'meat',
    unit: 'kg',
    defaultQty: 15,
    notes: 'مخلوط غنم وعجل 20% دهن',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-4',
    name: 'بطاطس فريتس نصف مقلية كريسبي 9x9',
    category: 'vegetables',
    unit: 'box',
    defaultQty: 12,
    notes: 'كرتون 10 كغ (ماركة Lutosa أو Farm Frites)',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-5',
    name: 'بندورة حمراء قاسية للسلطة والتقطيع',
    category: 'vegetables',
    unit: 'box',
    defaultQty: 5,
    notes: 'صندوق 6 كغ',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-6',
    name: 'خيار هولندي طازج درجة أولى',
    category: 'vegetables',
    unit: 'box',
    defaultQty: 4,
    notes: 'صندوق كرتون كبير',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-7',
    name: 'بصل أحمر حلو وبصل أبيض',
    category: 'vegetables',
    unit: 'bag',
    defaultQty: 4,
    notes: 'أكياس خيش 10 كغ',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-8',
    name: 'خس آيسبيرغ طازج (Iceberg)',
    category: 'vegetables',
    unit: 'box',
    defaultQty: 6,
    notes: '10 حبات في الصندوق',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-9',
    name: 'ثوم طازج مقشر ونظيف',
    category: 'vegetables',
    unit: 'box',
    defaultQty: 3,
    notes: 'علب بلاستيك 5 كغ لصوص الثوم',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-10',
    name: 'خبز صاج / سوري طازج رقيق',
    category: 'bread',
    unit: 'bag',
    defaultQty: 25,
    notes: 'أكياس 10 أرغفة من المخبز السوري',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-11',
    name: 'خبز تورتيلا 30 سم كبير',
    category: 'bread',
    unit: 'box',
    defaultQty: 8,
    notes: 'كرتون 72 حبة (للطلبات السريعة)',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-12',
    name: 'جبنة قشقوان فاخرة مبشورة',
    category: 'dairy_sauces',
    unit: 'kg',
    defaultQty: 18,
    notes: 'للمناقيش والكبسلون',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-13',
    name: 'جبنة موزاريلا مبشورة 100%',
    category: 'dairy_sauces',
    unit: 'kg',
    defaultQty: 20,
    notes: 'سريعة الذوبان للكبسلون',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-14',
    name: 'طحينة سمسم نقية درجة أولى',
    category: 'dry_goods',
    unit: 'box',
    defaultQty: 3,
    notes: 'سطل 18 كغ',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-15',
    name: 'مخلل خيار ولفت وردي مقرمش',
    category: 'dry_goods',
    unit: 'box',
    defaultQty: 4,
    notes: 'براميل بلاستيك 10 كغ',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-16',
    name: 'زيت نباتي نقي للقلي العميق',
    category: 'dry_goods',
    unit: 'box',
    defaultQty: 6,
    notes: 'علب معدنية 10 لتر',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-17',
    name: 'علب كبسولون ألمنيوم مع أغطية حرارية',
    category: 'packaging',
    unit: 'box',
    defaultQty: 5,
    notes: 'كرتون 500 علبة حجم وسط وكبير',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-18',
    name: 'ورق لف ساندويش مانع للزيوت مطبوع Tasty',
    category: 'packaging',
    unit: 'box',
    defaultQty: 3,
    notes: 'كرتون 1000 ورقة',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-19',
    name: 'أكياس ورقية كرافت بمقابض تيك أواي',
    category: 'packaging',
    unit: 'box',
    defaultQty: 4,
    notes: 'صندوق 250 كيس',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-20',
    name: 'مشروبات غازية كوكاكولا وفانتا وسبرايت',
    category: 'drinks',
    unit: 'box',
    defaultQty: 10,
    notes: 'علب كانز 330 مل كرتونة 24 حبة',
    isActive: true,
    createdAt: '2026-09-01',
  },
  {
    id: 'mi-21',
    name: 'عيران تركي مثلج Yayla',
    category: 'drinks',
    unit: 'box',
    defaultQty: 6,
    notes: 'صندوق 20 كوب 250 مل',
    isActive: true,
    createdAt: '2026-09-01',
  },
];

const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [];

const DEMO_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    orderNumber: '#ORD-2026-042',
    title: 'طلبية عطلة نهاية الأسبوع (سوق الجملة)',
    date: '2026-10-01',
    status: 'pending',
    notes: 'التركيز على لحوم الشاورما الطازجة والبطاطا والخبز قبل ازدحام الجمعة',
    createdAt: '2026-10-01T08:30:00Z',
    items: [
      {
        id: 'poi-1',
        masterItemId: 'mi-1',
        name: 'شاورما دجاج متبلة (جاهزة للشيش)',
        category: 'meat',
        unit: 'kg',
        quantity: 50,
        notes: 'تأكيد التسليم المبرد قبل الظهر',
        isPurchased: true,
        purchasedAt: '2026-10-01T10:15:00Z',
      },
      {
        id: 'poi-2',
        masterItemId: 'mi-2',
        name: 'لحم عجل طازج شاورما',
        category: 'meat',
        unit: 'kg',
        quantity: 35,
        notes: 'مبرد طازج درجة أولى',
        isPurchased: true,
        purchasedAt: '2026-10-01T10:20:00Z',
      },
      {
        id: 'poi-3',
        masterItemId: 'mi-4',
        name: 'بطاطس فريتس نصف مقلية كريسبي 9x9',
        category: 'vegetables',
        unit: 'box',
        quantity: 15,
        notes: 'كرتون 10 كغ كريسبي',
        isPurchased: true,
        purchasedAt: '2026-10-01T10:45:00Z',
      },
      {
        id: 'poi-4',
        masterItemId: 'mi-5',
        name: 'بندورة حمراء قاسية للسلطة والتقطيع',
        category: 'vegetables',
        unit: 'box',
        quantity: 6,
        notes: 'حمراء صلبة',
        isPurchased: false,
      },
      {
        id: 'poi-5',
        masterItemId: 'mi-6',
        name: 'خيار هولندي طازج درجة أولى',
        category: 'vegetables',
        unit: 'box',
        quantity: 5,
        notes: 'حجم متوسط',
        isPurchased: false,
      },
      {
        id: 'poi-6',
        masterItemId: 'mi-10',
        name: 'خبز صاج / سوري طازج رقيق',
        category: 'bread',
        unit: 'bag',
        quantity: 30,
        notes: 'تأكيد وصول المخبز الساعة 11:00',
        isPurchased: false,
      },
      {
        id: 'poi-7',
        masterItemId: 'mi-12',
        name: 'جبنة قشقوان فاخرة مبشورة',
        category: 'dairy_sauces',
        unit: 'kg',
        quantity: 15,
        notes: 'مبشورة جاهزة',
        isPurchased: false,
      },
      {
        id: 'poi-8',
        masterItemId: 'mi-17',
        name: 'علب كبسولون ألمنيوم مع أغطية حرارية',
        category: 'packaging',
        unit: 'box',
        quantity: 4,
        notes: '',
        isPurchased: true,
        purchasedAt: '2026-10-01T11:05:00Z',
      },
    ],
  },
  {
    id: 'po-2',
    orderNumber: '#ORD-2026-041',
    title: 'طلبية التغليف والمواد الجافة الأسبوع الماضي',
    date: '2026-09-27',
    status: 'completed',
    notes: 'تم استلام كافة المواد وفحص الجودة',
    completedAt: '2026-09-27T16:00:00Z',
    createdAt: '2026-09-27T09:00:00Z',
    items: [
      {
        id: 'poi-201',
        masterItemId: 'mi-14',
        name: 'طحينة سمسم نقية درجة أولى',
        category: 'dry_goods',
        unit: 'box',
        quantity: 2,
        notes: 'سطل 18 كغ',
        isPurchased: true,
        purchasedAt: '2026-09-27T12:00:00Z',
      },
      {
        id: 'poi-202',
        masterItemId: 'mi-16',
        name: 'زيت نباتي نقي للقلي العميق',
        category: 'dry_goods',
        unit: 'box',
        quantity: 8,
        notes: '',
        isPurchased: true,
        purchasedAt: '2026-09-27T12:30:00Z',
      },
      {
        id: 'poi-203',
        masterItemId: 'mi-18',
        name: 'ورق لف ساندويش مانع للزيوت مطبوع Tasty',
        category: 'packaging',
        unit: 'box',
        quantity: 5,
        notes: '',
        isPurchased: true,
        purchasedAt: '2026-09-27T13:00:00Z',
      },
    ],
  },
];

// Helper to calculate percentages
function computeSalesPercentages(cash: number, card: number) {
  const total = Number((cash + card).toFixed(2));
  if (total <= 0) return { total: 0, cashPct: 0, cardPct: 0 };
  const cashPct = Number(((cash / total) * 100).toFixed(1));
  const cardPct = Number((100 - cashPct).toFixed(1));
  return { total, cashPct, cardPct };
}

const INITIAL_DAILY_SALES: DailySalesRecord[] = [];

const DEMO_DAILY_SALES: DailySalesRecord[] = [
  {
    id: 'ds-1',
    date: '2026-10-01', // Today
    cashAmount: 540,
    cardAmount: 1620,
    totalAmount: 2160,
    cashPercentage: 25.0,
    cardPercentage: 75.0,
    notes: 'إقبال ممتاز على وجبات الكبسلون وساندوتشات الشاورما عائلي',
    recordedAt: '2026-10-01T20:45:00Z',
  },
  {
    id: 'ds-2',
    date: '2026-09-30',
    cashAmount: 420,
    cardAmount: 1380,
    totalAmount: 1800,
    cashPercentage: 23.3,
    cardPercentage: 76.7,
    notes: 'يوم أربعاء هادئ - إقبال مرتفع وقت الغداء 12-3 ظهراً',
    recordedAt: '2026-09-30T21:10:00Z',
  },
  {
    id: 'ds-3',
    date: '2026-09-29',
    cashAmount: 390,
    cardAmount: 1210,
    totalAmount: 1600,
    cashPercentage: 24.4,
    cardPercentage: 75.6,
    notes: 'مبيعات طلبات تيك أواي ممتازة',
    recordedAt: '2026-09-29T21:00:00Z',
  },
  {
    id: 'ds-4',
    date: '2026-09-28',
    cashAmount: 480,
    cardAmount: 1470,
    totalAmount: 1950,
    cashPercentage: 24.6,
    cardPercentage: 75.4,
    notes: 'طلب حفلة خارجية لموظفي البلدية + مبيعات الصالة',
    recordedAt: '2026-09-28T21:30:00Z',
  },
  {
    id: 'ds-5',
    date: '2026-09-27',
    cashAmount: 780,
    cardAmount: 2140,
    totalAmount: 2920,
    cashPercentage: 26.7,
    cardPercentage: 73.3,
    notes: 'ذروة عطلة الأحد - نفاد كامل لدجاج الشاورما قبل الإغلاق بساعة',
    recordedAt: '2026-09-27T22:15:00Z',
  },
  {
    id: 'ds-6',
    date: '2026-09-26',
    cashAmount: 850,
    cardAmount: 2350,
    totalAmount: 3200,
    cashPercentage: 26.6,
    cardPercentage: 73.4,
    notes: 'سبت مزدحم جداً - أعلى مبيعات كبسولون ومناقيش هذا الأسبوع',
    recordedAt: '2026-09-26T22:30:00Z',
  },
];

const INITIAL_DEBTS: DebtRecord[] = [];

const DEMO_DEBTS: DebtRecord[] = [
  {
    id: 'debt-1',
    partyName: 'ملحمة الأندلس الدولية (مورد اللحوم)',
    type: 'payable', // دين علينا
    category: 'supplier',
    phone: '+31 6 12345678',
    totalAmount: 1850,
    paidAmount: 1100,
    remainingAmount: 750,
    status: 'partially_paid',
    createdDate: '2026-09-20',
    dueDate: '2026-10-05',
    description: 'فاتورة لحوم شاورما عجل ودجاج لشهر سبتمبر (رقم الفاتورة #INV-992)',
    payments: [
      {
        id: 'pay-1',
        debtId: 'debt-1',
        amount: 600,
        date: '2026-09-22',
        method: 'bank_transfer',
        note: 'دفعة أولى تحويل بنكي Rabobank',
        createdAt: '2026-09-22T14:00:00Z',
      },
      {
        id: 'pay-2',
        debtId: 'debt-1',
        amount: 500,
        date: '2026-09-28',
        method: 'cash',
        note: 'دفعة ثانية نقداً مع السائق',
        createdAt: '2026-09-28T16:30:00Z',
      },
    ],
  },
  {
    id: 'debt-2',
    partyName: 'شركة فيرس لاند هيلفرسوم (خضار وفواكه)',
    type: 'payable',
    category: 'supplier',
    phone: '+31 35 6889900',
    totalAmount: 430,
    paidAmount: 0,
    remainingAmount: 430,
    status: 'unpaid',
    createdDate: '2026-09-29',
    dueDate: '2026-10-06',
    description: 'شحنة الخضار الأسبوعية (بطاطس، بندورة، خس، بصل)',
    payments: [],
  },
  {
    id: 'debt-3',
    partyName: 'شركة يوروباك لتجارة مواد التغليف والعلب',
    type: 'payable',
    category: 'supplier',
    phone: '+31 20 4455667',
    totalAmount: 680,
    paidAmount: 680,
    remainingAmount: 0,
    status: 'paid',
    createdDate: '2026-09-10',
    dueDate: '2026-09-25',
    description: 'طلب كراتين كبسولون وأكياس كرافت مطبوعة 5000 قطعة',
    payments: [
      {
        id: 'pay-3',
        debtId: 'debt-3',
        amount: 680,
        date: '2026-09-24',
        method: 'bank_transfer',
        note: 'سداد كامل المبلغ إلكترونياً',
        createdAt: '2026-09-24T11:00:00Z',
      },
    ],
  },
  {
    id: 'debt-4',
    partyName: 'شركة كيركسترات للمقاولات (بوفيه ضيافة 40 شخص)',
    type: 'receivable', // دين لنا على الزبون
    category: 'customer',
    phone: '+31 6 88776655',
    totalAmount: 640,
    paidAmount: 300,
    remainingAmount: 340,
    status: 'partially_paid',
    createdDate: '2026-09-25',
    dueDate: '2026-10-05',
    description: 'وجبات عائلية مشكلة كبسولون ومناقيش لحفلة افتتاح فرعهم الجديد',
    payments: [
      {
        id: 'pay-4',
        debtId: 'debt-4',
        amount: 300,
        date: '2026-09-25',
        method: 'pin',
        note: 'عربون مدفوع بالبطاقة وقت تثبيت الطلب',
        createdAt: '2026-09-25T13:00:00Z',
      },
    ],
  },
  {
    id: 'debt-5',
    partyName: 'مركز تدريب هيلفرسوم الرياضي (وجبات أسبوعية)',
    type: 'receivable',
    category: 'customer',
    phone: '+31 6 44332211',
    totalAmount: 280,
    paidAmount: 0,
    remainingAmount: 280,
    status: 'unpaid',
    createdDate: '2026-09-30',
    dueDate: '2026-10-07',
    description: 'وجبات شاورما دايت صحية مع أرز وسلطات للكادر التدريبي',
    payments: [],
  },
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'أبو أحمد الشامي',
    phone: '0612345671',
    role: 'معلم شاورما رئيسي',
    wageType: 'hourly',
    rate: 14.5,
    scheduleType: 'fixed',
    defaultHours: 8,
    defaultStartTime: '10:00',
    defaultEndTime: '18:30',
    defaultBreakMinutes: 30,
    workingDays: [1, 2, 3, 4, 5, 6, 0], // طيلة الأسبوع
    isActive: true,
    startDate: '2026-01-15',
    notes: 'مسؤول سيخ الشاورما وتجهيز التتبيلة الصباحية',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'emp-2',
    name: 'سامر العلي',
    phone: '0687654321',
    role: 'كاشير وخدمة صالة',
    wageType: 'hourly',
    rate: 12.0,
    scheduleType: 'fixed',
    defaultHours: 7.5,
    defaultStartTime: '11:00',
    defaultEndTime: '19:00',
    defaultBreakMinutes: 30,
    workingDays: [2, 3, 4, 5, 6, 0], // ما عدا الاثنين
    isActive: true,
    startDate: '2026-03-01',
    notes: 'استلام الصندوق وطلبيات الهاتف والزبائن',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'emp-3',
    name: 'محمود الحلبي',
    phone: '0645678912',
    role: 'شيف معجنات ومناقيش',
    wageType: 'hourly',
    rate: 13.5,
    scheduleType: 'fixed',
    defaultHours: 7.5,
    defaultStartTime: '09:00',
    defaultEndTime: '17:00',
    defaultBreakMinutes: 30,
    workingDays: [2, 3, 4, 5, 6, 0], // ما عدا الاثنين
    isActive: true,
    startDate: '2026-02-10',
    notes: 'فرن المعجنات، العجين، والصفائح الشامية',
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'emp-4',
    name: 'يوسف المصري',
    phone: '0698761234',
    role: 'مساعد مطبخ وتجهيز وسلطات',
    wageType: 'hourly',
    rate: 11.5,
    scheduleType: 'flexible', // دوام مرن عند الحاجة
    defaultHours: 8,
    defaultStartTime: '12:00',
    defaultEndTime: '20:30',
    defaultBreakMinutes: 30,
    workingDays: [5, 6, 0], // عطلة نهاية الأسبوع
    isActive: true,
    startDate: '2026-05-01',
    notes: 'تقطيع الخضار والمقالي والتغليف - دوام مرن',
    createdAt: '2026-05-01T10:00:00Z',
  },
];

const DEMO_EMPLOYEE_SHIFTS: EmployeeShift[] = [
  {
    id: 'shift-1',
    employeeId: 'emp-1',
    employeeName: 'أبو أحمد الشامي',
    date: '2026-10-06',
    startTime: '10:00',
    endTime: '18:30',
    breakMinutes: 30,
    totalHours: 8.0,
    hourlyRate: 14.5,
    totalEarned: 116.0,
    paymentStatus: 'paid_cash',
    paidAmount: 116.0,
    notes: 'تسليم اليومية كاش نهاية الوردية',
    createdAt: '2026-10-06T18:30:00Z',
  },
  {
    id: 'shift-2',
    employeeId: 'emp-2',
    employeeName: 'سامر العلي',
    date: '2026-10-06',
    startTime: '11:00',
    endTime: '19:00',
    breakMinutes: 30,
    totalHours: 7.5,
    hourlyRate: 12.0,
    totalEarned: 90.0,
    paymentStatus: 'unpaid',
    paidAmount: 0,
    notes: 'حساب أسبوعي يتم تسليمه الأحد',
    createdAt: '2026-10-06T19:00:00Z',
  },
  {
    id: 'shift-3',
    employeeId: 'emp-3',
    employeeName: 'محمود الحلبي',
    date: '2026-10-05',
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: 30,
    totalHours: 7.5,
    hourlyRate: 13.5,
    totalEarned: 101.25,
    paymentStatus: 'paid_bank',
    paidAmount: 101.25,
    notes: 'تم التحويل لحسابه البنكي',
    createdAt: '2026-10-05T17:00:00Z',
  },
  {
    id: 'shift-4',
    employeeId: 'emp-4',
    employeeName: 'يوسف المصري',
    date: '2026-10-05',
    startTime: '12:00',
    endTime: '20:30',
    breakMinutes: 30,
    totalHours: 8.0,
    hourlyRate: 11.5,
    totalEarned: 92.0,
    paymentStatus: 'unpaid',
    paidAmount: 0,
    notes: 'مستحق معلق',
    createdAt: '2026-10-05T20:30:00Z',
  },
];

const DEMO_EMPLOYEE_ADVANCES: EmployeeAdvance[] = [
  {
    id: 'adv-1',
    employeeId: 'emp-2',
    employeeName: 'سامر العلي',
    amount: 50.0,
    date: '2026-10-06',
    paymentMethod: 'cash',
    paymentType: 'advance',
    notes: 'سلفة نقدية من صندوق الكاش',
    createdAt: '2026-10-06T15:00:00Z',
  },
  {
    id: 'adv-2',
    employeeId: 'emp-4',
    employeeName: 'يوسف المصري',
    amount: 30.0,
    date: '2026-10-05',
    paymentMethod: 'cash',
    paymentType: 'advance',
    notes: 'دفعة نقدية مسحوبة من الكاش',
    createdAt: '2026-10-05T16:30:00Z',
  }
];

// -------------------------------------------------------------
// Server Sync State & Helpers
// -------------------------------------------------------------
export type SyncStatus = 'synced' | 'local_only' | 'syncing' | 'error';

let currentSyncStatus: SyncStatus = 'local_only';
let lastSyncedTime: string | null = null;
let bgSyncTimer: any = null;

async function postToServer(payload: any): Promise<boolean> {
  const endpoints = ['/api/sync.php', 'api/sync.php', '/tasty/api/sync.php'];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success') {
          return true;
        }
      }
    } catch {
      // try next
    }
  }
  return false;
}

async function fetchFromServer(): Promise<any | null> {
  const endpoints = ['/api/sync.php', 'api/sync.php', '/tasty/api/sync.php'];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          return json.data;
        }
        if (json.status === 'empty') {
          return 'empty';
        }
      }
    } catch {
      // try next
    }
  }
  return null;
}

// -------------------------------------------------------------
// Storage Service Class
// -------------------------------------------------------------
export const StorageService = {
  // Subscription helper
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(STORAGE_KEYS.EVENT_NAME, handler);
    return () => window.removeEventListener(STORAGE_KEYS.EVENT_NAME, handler);
  },

  // SERVER SYNC METHODS
  getSyncInfo(): { status: SyncStatus; lastSyncedTime: string | null } {
    return { status: currentSyncStatus, lastSyncedTime };
  },

  async initServerSync(): Promise<void> {
    currentSyncStatus = 'syncing';
    notifySubscribers();

    try {
      const serverResult = await fetchFromServer();
      if (serverResult && serverResult !== 'empty') {
        // Server database exists -> hydrate local state from server
        if (Array.isArray(serverResult.masterItems)) {
          localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(serverResult.masterItems));
        }
        if (Array.isArray(serverResult.purchaseOrders)) {
          localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(serverResult.purchaseOrders));
        }
        if (Array.isArray(serverResult.dailySales)) {
          localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(serverResult.dailySales));
        }
        if (Array.isArray(serverResult.debts)) {
          localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(serverResult.debts));
        }
        if (Array.isArray(serverResult.employees)) {
          localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(serverResult.employees));
        }
        if (Array.isArray(serverResult.employeeShifts)) {
          localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify(serverResult.employeeShifts));
        }
        if (Array.isArray(serverResult.employeeAdvances)) {
          localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ADVANCES, JSON.stringify(serverResult.employeeAdvances));
        }
        currentSyncStatus = 'synced';
        lastSyncedTime = new Date().toLocaleTimeString('ar-NL', { hour: '2-digit', minute: '2-digit' });
        notifySubscribers();
        return;
      }

      if (serverResult === 'empty') {
        // Server database is empty -> push local database to server to seed it
        await this.syncToServer();
        return;
      }

      currentSyncStatus = 'local_only';
      notifySubscribers();
    } catch {
      currentSyncStatus = 'local_only';
      notifySubscribers();
    }
  },

  async syncToServer(): Promise<boolean> {
    currentSyncStatus = 'syncing';
    notifySubscribers();

    const payload = {
      masterItems: this.getMasterItems(),
      purchaseOrders: this.getPurchaseOrders(),
      dailySales: this.getDailySales(),
      debts: this.getDebts(),
      employees: this.getEmployees(),
      employeeShifts: this.getEmployeeShifts(),
      employeeAdvances: this.getEmployeeAdvances(),
      clientTimestamp: new Date().toISOString(),
    };

    const ok = await postToServer(payload);
    if (ok) {
      currentSyncStatus = 'synced';
      lastSyncedTime = new Date().toLocaleTimeString('ar-NL', { hour: '2-digit', minute: '2-digit' });
    } else {
      currentSyncStatus = 'local_only';
    }
    notifySubscribers();
    return ok;
  },

  triggerBackgroundSync(): void {
    if (bgSyncTimer) clearTimeout(bgSyncTimer);
    bgSyncTimer = setTimeout(() => {
      this.syncToServer();
    }, 500);
  },

  async triggerManualSync(): Promise<{ success: boolean; message: string }> {
    const success = await this.syncToServer();
    if (success) {
      return { success: true, message: 'تمت مزامنة وحفظ كافة البيانات على السيرفر بنجاح!' };
    } else {
      return { success: false, message: 'السيرفر غير متاح حالياً. تم الحفظ محلياً في ذاكرة المتصفح وسيعاد الحفظ تلقائياً فور توفر السيرفر.' };
    }
  },

  // 1. MASTER ITEMS
  getMasterItems(): MasterItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MASTER_ITEMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(INITIAL_MASTER_ITEMS));
        return INITIAL_MASTER_ITEMS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading master items:', e);
      return INITIAL_MASTER_ITEMS;
    }
  },

  saveMasterItem(item: Omit<MasterItem, 'id' | 'createdAt'> & { id?: string }): MasterItem {
    const items = this.getMasterItems();
    if (item.id) {
      // Update
      const index = items.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        items[index] = { ...items[index], ...item };
        localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(items));
        notifySubscribers();
        return items[index];
      }
    }
    // Create new
    const newItem: MasterItem = {
      ...item,
      id: `mi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: item.isActive ?? true,
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(items));
    notifySubscribers();
    return newItem;
  },

  deleteMasterItem(id: string): void {
    const items = this.getMasterItems().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(items));
    notifySubscribers();
  },

  // 2. PURCHASE ORDERS
  getPurchaseOrders(): PurchaseOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(INITIAL_PURCHASE_ORDERS));
        return INITIAL_PURCHASE_ORDERS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading purchase orders:', e);
      return INITIAL_PURCHASE_ORDERS;
    }
  },

  getPurchaseOrderById(id: string): PurchaseOrder | undefined {
    return this.getPurchaseOrders().find((o) => o.id === id);
  },

  savePurchaseOrder(order: Partial<PurchaseOrder> & { title: string; items: any[] }): PurchaseOrder {
    const orders = this.getPurchaseOrders();
    if (order.id) {
      const index = orders.findIndex((o) => o.id === order.id);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...order } as PurchaseOrder;
        localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(orders));
        notifySubscribers();
        return orders[index];
      }
    }
    // Create new
    const newNumber = `#ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder: PurchaseOrder = {
      id: `po-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderNumber: order.orderNumber || newNumber,
      title: order.title,
      date: order.date || new Date().toISOString().split('T')[0],
      status: order.status || 'pending',
      items: order.items || [],
      notes: order.notes || '',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(orders));
    notifySubscribers();
    return newOrder;
  },

  toggleOrderItemPurchased(orderId: string, itemId: string, isPurchased?: boolean): PurchaseOrder | null {
    const orders = this.getPurchaseOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const item = order.items.find((i) => i.id === itemId);
    if (!item) return null;

    const nextState = isPurchased !== undefined ? isPurchased : !item.isPurchased;
    item.isPurchased = nextState;
    item.purchasedAt = nextState ? new Date().toISOString() : undefined;

    // Check if all items purchased -> auto mark order completed if desired
    const allChecked = order.items.length > 0 && order.items.every((i) => i.isPurchased);
    if (allChecked && order.status !== 'completed') {
      order.status = 'completed';
      order.completedAt = new Date().toISOString();
    } else if (!allChecked && order.status === 'completed') {
      order.status = 'pending';
      order.completedAt = undefined;
    }

    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(orders));
    notifySubscribers();
    return order;
  },

  deletePurchaseOrder(id: string): void {
    const orders = this.getPurchaseOrders().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(orders));
    notifySubscribers();
  },

  // 3. DAILY SALES
  getDailySales(): DailySalesRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_SALES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(INITIAL_DAILY_SALES));
        return INITIAL_DAILY_SALES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading daily sales:', e);
      return INITIAL_DAILY_SALES;
    }
  },

  saveDailySale(entry: {
    id?: string;
    date: string;
    cashAmount: number;
    cardAmount: number;
    notes?: string;
  }): DailySalesRecord {
    const sales = this.getDailySales();
    const cash = Number(entry.cashAmount) || 0;
    const card = Number(entry.cardAmount) || 0;
    const { total, cashPct, cardPct } = computeSalesPercentages(cash, card);

    if (entry.id) {
      const index = sales.findIndex((s) => s.id === entry.id);
      if (index !== -1) {
        sales[index] = {
          ...sales[index],
          date: entry.date,
          cashAmount: cash,
          cardAmount: card,
          totalAmount: total,
          cashPercentage: cashPct,
          cardPercentage: cardPct,
          notes: entry.notes || '',
        };
        localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(sales));
        notifySubscribers();
        return sales[index];
      }
    }

    // Check if date already exists to prevent duplicates or update seamlessly
    const existingDateIdx = sales.findIndex((s) => s.date === entry.date);
    if (existingDateIdx !== -1) {
      sales[existingDateIdx] = {
        ...sales[existingDateIdx],
        cashAmount: cash,
        cardAmount: card,
        totalAmount: total,
        cashPercentage: cashPct,
        cardPercentage: cardPct,
        notes: entry.notes || sales[existingDateIdx].notes,
      };
      localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(sales));
      notifySubscribers();
      return sales[existingDateIdx];
    }

    const newRecord: DailySalesRecord = {
      id: `ds-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: entry.date,
      cashAmount: cash,
      cardAmount: card,
      totalAmount: total,
      cashPercentage: cashPct,
      cardPercentage: cardPct,
      notes: entry.notes || '',
      recordedAt: new Date().toISOString(),
    };

    sales.unshift(newRecord);
    // Sort descending by date
    sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(sales));
    notifySubscribers();
    return newRecord;
  },

  deleteDailySale(id: string): void {
    const sales = this.getDailySales().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(sales));
    notifySubscribers();
  },

  getSalesStats() {
    const sales = this.getDailySales();
    const now = new Date();
    
    // Total all time
    let totalAll = 0;
    let totalCashAll = 0;
    let totalCardAll = 0;

    // This week (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    let weekTotal = 0;
    let weekCash = 0;
    let weekCard = 0;

    // This month (current YYYY-MM)
    const currentMonthPrefix = now.toISOString().slice(0, 7); // e.g. "2026-10"
    let monthTotal = 0;
    let monthCash = 0;
    let monthCard = 0;

    sales.forEach((s) => {
      const sDate = new Date(s.date);
      totalAll += s.totalAmount;
      totalCashAll += s.cashAmount;
      totalCardAll += s.cardAmount;

      if (sDate >= sevenDaysAgo) {
        weekTotal += s.totalAmount;
        weekCash += s.cashAmount;
        weekCard += s.cardAmount;
      }

      if (s.date.startsWith(currentMonthPrefix)) {
        monthTotal += s.totalAmount;
        monthCash += s.cashAmount;
        monthCard += s.cardAmount;
      }
    });

    const averageDaily = sales.length > 0 ? Number((totalAll / sales.length).toFixed(2)) : 0;

    return {
      all: { total: totalAll, cash: totalCashAll, card: totalCardAll, count: sales.length },
      week: { total: weekTotal, cash: weekCash, card: weekCard },
      month: { total: monthTotal, cash: monthCash, card: monthCard },
      averageDaily,
    };
  },

  // 4. DEBTS & PAYMENTS
  getDebts(): DebtRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEBTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(INITIAL_DEBTS));
        return INITIAL_DEBTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading debts:', e);
      return INITIAL_DEBTS;
    }
  },

  saveDebt(debt: {
    id?: string;
    partyName: string;
    type: 'payable' | 'receivable';
    phone?: string;
    category?: 'supplier' | 'customer' | 'maintenance' | 'other';
    totalAmount: number;
    createdDate?: string;
    dueDate?: string;
    description?: string;
  }): DebtRecord {
    const debts = this.getDebts();
    const total = Number(debt.totalAmount) || 0;

    if (debt.id) {
      const index = debts.findIndex((d) => d.id === debt.id);
      if (index !== -1) {
        const existing = debts[index];
        const remaining = Math.max(0, total - existing.paidAmount);
        let status: 'unpaid' | 'partially_paid' | 'paid' = 'unpaid';
        if (remaining <= 0) status = 'paid';
        else if (existing.paidAmount > 0) status = 'partially_paid';

        debts[index] = {
          ...existing,
          ...debt,
          totalAmount: total,
          remainingAmount: remaining,
          status,
        };
        localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
        notifySubscribers();
        return debts[index];
      }
    }

    // New debt
    const newDebt: DebtRecord = {
      id: `debt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      partyName: debt.partyName,
      type: debt.type,
      phone: debt.phone || '',
      category: debt.category || (debt.type === 'payable' ? 'supplier' : 'customer'),
      totalAmount: total,
      paidAmount: 0,
      remainingAmount: total,
      status: 'unpaid',
      createdDate: debt.createdDate || new Date().toISOString().split('T')[0],
      dueDate: debt.dueDate || '',
      description: debt.description || '',
      payments: [],
    };

    debts.unshift(newDebt);
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
    notifySubscribers();
    return newDebt;
  },

  addDebtPayment(debtId: string, payment: {
    amount: number;
    date: string;
    method: 'cash' | 'bank_transfer' | 'pin';
    note?: string;
  }): DebtRecord | null {
    const debts = this.getDebts();
    const index = debts.findIndex((d) => d.id === debtId);
    if (index === -1) return null;

    const debt = debts[index];
    const pAmount = Number(payment.amount) || 0;
    if (pAmount <= 0) return debt;

    const newPayment: DebtPayment = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      debtId,
      amount: pAmount,
      date: payment.date || new Date().toISOString().split('T')[0],
      method: payment.method || 'cash',
      note: payment.note || '',
      createdAt: new Date().toISOString(),
    };

    debt.payments.unshift(newPayment);
    debt.paidAmount = Number((debt.paidAmount + pAmount).toFixed(2));
    debt.remainingAmount = Math.max(0, Number((debt.totalAmount - debt.paidAmount).toFixed(2)));

    if (debt.remainingAmount <= 0) {
      debt.status = 'paid';
    } else {
      debt.status = 'partially_paid';
    }

    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
    notifySubscribers();
    return debt;
  },

  deleteDebt(id: string): void {
    const debts = this.getDebts().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
    notifySubscribers();
  },

  getDebtStats() {
    const debts = this.getDebts();
    let payableTotal = 0;
    let payablePaid = 0;
    let payableRemaining = 0;

    let receivableTotal = 0;
    let receivablePaid = 0;
    let receivableRemaining = 0;

    debts.forEach((d) => {
      if (d.type === 'payable') {
        payableTotal += d.totalAmount;
        payablePaid += d.paidAmount;
        payableRemaining += d.remainingAmount;
      } else {
        receivableTotal += d.totalAmount;
        receivablePaid += d.paidAmount;
        receivableRemaining += d.remainingAmount;
      }
    });

    return {
      payable: {
        total: payableTotal,
        paid: payablePaid,
        remaining: payableRemaining,
      },
      receivable: {
        total: receivableTotal,
        paid: receivablePaid,
        remaining: receivableRemaining,
      },
      netBalance: receivableRemaining - payableRemaining,
    };
  },

  // 5. EMPLOYEES & SHIFTS
  getEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
        return INITIAL_EMPLOYEES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EMPLOYEES;
    }
  },

  saveEmployee(employee: Partial<Employee> & { name: string }): Employee {
    const list = this.getEmployees();
    if (employee.id) {
      const index = list.findIndex((e) => e.id === employee.id);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          ...employee,
        };
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
        notifySubscribers();
        return list[index];
      }
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: employee.name.trim(),
      phone: employee.phone?.trim() || '',
      role: employee.role?.trim() || 'موظف',
      wageType: employee.wageType || 'hourly',
      rate: Number(employee.rate) || 0,
      scheduleType: employee.scheduleType || 'flexible',
      defaultHours: employee.defaultHours !== undefined ? Number(employee.defaultHours) : 8,
      defaultStartTime: employee.defaultStartTime || '10:00',
      defaultEndTime: employee.defaultEndTime || '18:00',
      defaultBreakMinutes: employee.defaultBreakMinutes !== undefined ? employee.defaultBreakMinutes : 30,
      workingDays: employee.workingDays || [1, 2, 3, 4, 5, 6, 0],
      isActive: employee.isActive !== false,
      startDate: employee.startDate || new Date().toISOString().split('T')[0],
      notes: employee.notes?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    list.push(newEmp);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
    notifySubscribers();
    return newEmp;
  },

  deleteEmployee(id: string): void {
    const list = this.getEmployees().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
    notifySubscribers();
  },

  getEmployeeShifts(): EmployeeShift[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEE_SHIFTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify(DEMO_EMPLOYEE_SHIFTS));
        return DEMO_EMPLOYEE_SHIFTS;
      }
      return JSON.parse(data);
    } catch {
      return DEMO_EMPLOYEE_SHIFTS;
    }
  },

  saveEmployeeShift(shift: {
    id?: string;
    employeeId: string;
    employeeName?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    breakMinutes?: number;
    totalHours?: number;
    hourlyRate?: number;
    paymentStatus?: ShiftPaymentStatus;
    paidAmount?: number;
    notes?: string;
  }): EmployeeShift {
    const shifts = this.getEmployeeShifts();
    const employees = this.getEmployees();
    const targetEmp = employees.find((e) => e.id === shift.employeeId);
    const empName = shift.employeeName || targetEmp?.name || 'موظف';
    const rate = shift.hourlyRate !== undefined ? Number(shift.hourlyRate) : (targetEmp?.rate || 0);

    let netHours = 8;
    let startTime = shift.startTime || targetEmp?.defaultStartTime || '10:00';
    let endTime = shift.endTime || targetEmp?.defaultEndTime || '18:00';
    const breakMins = shift.breakMinutes !== undefined ? Number(shift.breakMinutes) : (targetEmp?.defaultBreakMinutes ?? 30);

    if (shift.totalHours !== undefined && Number(shift.totalHours) > 0) {
      netHours = Number(shift.totalHours);
      if (!shift.startTime || !shift.endTime) {
        const startH = 10;
        const totalDurationMins = Math.round(netHours * 60) + breakMins;
        const endTotalMins = startH * 60 + totalDurationMins;
        const endH = Math.floor(endTotalMins / 60) % 24;
        const endM = endTotalMins % 60;
        startTime = '10:00';
        endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
      }
    } else {
      // Calculate duration in hours
      const [startH, startM] = (startTime).split(':').map(Number);
      const [endH, endM] = (endTime).split(':').map(Number);
      let durationMinutes = (endH * 60 + (endM || 0)) - (startH * 60 + (startM || 0));
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60; // crossed midnight
      }
      const netMinutes = Math.max(0, durationMinutes - breakMins);
      netHours = Number((netMinutes / 60).toFixed(2));
    }

    const totalEarned = Number((netHours * rate).toFixed(2));
    const status = shift.paymentStatus || 'unpaid';
    const paid = status === 'unpaid' ? 0 : (shift.paidAmount !== undefined ? Number(shift.paidAmount) : totalEarned);

    if (shift.id) {
      const index = shifts.findIndex((s) => s.id === shift.id);
      if (index !== -1) {
        shifts[index] = {
          ...shifts[index],
          employeeId: shift.employeeId,
          employeeName: empName,
          date: shift.date,
          startTime: startTime,
          endTime: endTime,
          breakMinutes: breakMins,
          totalHours: netHours,
          hourlyRate: rate,
          totalEarned,
          paymentStatus: status,
          paidAmount: paid,
          notes: shift.notes?.trim() || '',
        };
        localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify(shifts));
        notifySubscribers();
        return shifts[index];
      }
    }

    const newShift: EmployeeShift = {
      id: `shift-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      employeeId: shift.employeeId,
      employeeName: empName,
      date: shift.date || new Date().toISOString().split('T')[0],
      startTime: startTime,
      endTime: endTime,
      breakMinutes: breakMins,
      totalHours: netHours,
      hourlyRate: rate,
      totalEarned,
      paymentStatus: status,
      paidAmount: paid,
      notes: shift.notes?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    shifts.unshift(newShift);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify(shifts));
    notifySubscribers();
    return newShift;
  },

  deleteEmployeeShift(id: string): void {
    const list = this.getEmployeeShifts().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify(list));
    notifySubscribers();
  },

  updateShiftPayment(id: string, paymentStatus: ShiftPaymentStatus, paidAmount?: number): EmployeeShift | null {
    const shifts = this.getEmployeeShifts();
    const index = shifts.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const shift = shifts[index];
    shift.paymentStatus = paymentStatus;
    if (paymentStatus === 'unpaid') {
      shift.paidAmount = 0;
    } else {
      shift.paidAmount = paidAmount !== undefined ? paidAmount : shift.totalEarned;
    }

    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify(shifts));
    notifySubscribers();
    return shift;
  },

  // Check which fixed staff are scheduled for a date but not logged yet
  getUnloggedFixedStaff(targetDate?: string): Employee[] {
    const dateStr = targetDate || new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(dateStr).getDay();
    const employees = this.getEmployees().filter((e) => e.isActive && e.scheduleType === 'fixed');
    const existingShifts = this.getEmployeeShifts();

    return employees.filter((emp) => {
      const isWorkingDay = !emp.workingDays || emp.workingDays.length === 0 || emp.workingDays.includes(dayOfWeek);
      if (!isWorkingDay) return false;
      const alreadyLogged = existingShifts.some((s) => s.employeeId === emp.id && s.date === dateStr);
      return !alreadyLogged;
    });
  },

  // Auto-generate shifts for fixed employees scheduled for a given date
  generateTodayFixedShifts(targetDate?: string): { addedCount: number; alreadyCount: number } {
    const dateStr = targetDate || new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(dateStr).getDay();
    const employees = this.getEmployees().filter((e) => e.isActive && e.scheduleType === 'fixed');
    const existingShifts = this.getEmployeeShifts();

    let addedCount = 0;
    let alreadyCount = 0;

    employees.forEach((emp) => {
      const isWorkingDay = !emp.workingDays || emp.workingDays.length === 0 || emp.workingDays.includes(dayOfWeek);
      if (!isWorkingDay) return;

      const alreadyLogged = existingShifts.some((s) => s.employeeId === emp.id && s.date === dateStr);
      if (alreadyLogged) {
        alreadyCount++;
        return;
      }

      this.saveEmployeeShift({
        employeeId: emp.id,
        employeeName: emp.name,
        date: dateStr,
        startTime: emp.defaultStartTime || '10:00',
        endTime: emp.defaultEndTime || '18:00',
        breakMinutes: emp.defaultBreakMinutes !== undefined ? emp.defaultBreakMinutes : 30,
        hourlyRate: emp.rate,
        paymentStatus: 'unpaid',
        notes: 'تسجيل آلي من جدول الدوام الثابت',
      });
      addedCount++;
    });

    return { addedCount, alreadyCount };
  },

  // Auto-generate shifts for entire week for all fixed employees
  generateWeekFixedShifts(startMonStr?: string): { addedCount: number } {
    let baseDate: Date;
    if (startMonStr) {
      baseDate = new Date(startMonStr);
    } else {
      const now = new Date();
      const day = now.getDay();
      const diffToMon = (day === 0 ? -6 : 1) - day;
      baseDate = new Date(now);
      baseDate.setDate(now.getDate() + diffToMon);
    }

    let totalAdded = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      const res = this.generateTodayFixedShifts(dStr);
      totalAdded += res.addedCount;
    }

    return { addedCount: totalAdded };
  },

  // 1-Click quick shift check-in for an employee
  logShiftQuickForEmployee(employeeId: string, dateStr?: string, hours?: number, status: ShiftPaymentStatus = 'unpaid'): EmployeeShift | null {
    const employees = this.getEmployees();
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return null;
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const totalHours = hours !== undefined ? hours : (emp.defaultHours || 8);
    return this.saveEmployeeShift({
      employeeId: emp.id,
      employeeName: emp.name,
      date: targetDate,
      totalHours,
      hourlyRate: emp.rate,
      paymentStatus: status,
      notes: 'تسجيل سريع بنقرة واحدة',
    });
  },

  // 6. EMPLOYEE ADVANCES & CASH PAYMENTS (سحبيات ودفعات الموظفين)
  getEmployeeAdvances(): EmployeeAdvance[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEE_ADVANCES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ADVANCES, JSON.stringify(DEMO_EMPLOYEE_ADVANCES));
        return DEMO_EMPLOYEE_ADVANCES;
      }
      return JSON.parse(data);
    } catch {
      return DEMO_EMPLOYEE_ADVANCES;
    }
  },

  saveEmployeeAdvance(advance: {
    id?: string;
    employeeId: string;
    employeeName?: string;
    amount: number;
    date: string;
    paymentMethod?: EmployeePaymentMethod;
    paymentType?: EmployeePaymentType;
    notes?: string;
  }): EmployeeAdvance {
    const list = this.getEmployeeAdvances();
    const employees = this.getEmployees();
    const emp = employees.find((e) => e.id === advance.employeeId);
    const empName = advance.employeeName || emp?.name || 'موظف';
    const amount = Number(advance.amount) || 0;

    if (advance.id) {
      const index = list.findIndex((a) => a.id === advance.id);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          employeeId: advance.employeeId,
          employeeName: empName,
          amount,
          date: advance.date,
          paymentMethod: advance.paymentMethod || 'cash',
          paymentType: advance.paymentType || 'advance',
          notes: advance.notes?.trim() || '',
        };
        localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ADVANCES, JSON.stringify(list));
        notifySubscribers();
        return list[index];
      }
    }

    const newAdvance: EmployeeAdvance = {
      id: `adv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      employeeId: advance.employeeId,
      employeeName: empName,
      amount,
      date: advance.date || new Date().toISOString().split('T')[0],
      paymentMethod: advance.paymentMethod || 'cash',
      paymentType: advance.paymentType || 'advance',
      notes: advance.notes?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    list.unshift(newAdvance);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ADVANCES, JSON.stringify(list));
    notifySubscribers();
    return newAdvance;
  },

  deleteEmployeeAdvance(id: string): void {
    const list = this.getEmployeeAdvances().filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ADVANCES, JSON.stringify(list));
    notifySubscribers();
  },

  getEmployeeStats(filteredShifts?: EmployeeShift[], filteredAdvances?: EmployeeAdvance[]) {
    const shifts = filteredShifts || this.getEmployeeShifts();
    const advances = filteredAdvances || this.getEmployeeAdvances();
    const employees = this.getEmployees();

    let totalHours = 0;
    let totalWages = 0;
    let totalPaidShifts = 0;
    let totalAdvances = 0;

    shifts.forEach((s) => {
      totalHours += s.totalHours;
      totalWages += s.totalEarned;
      totalPaidShifts += (s.paidAmount || 0);
    });

    advances.forEach((a) => {
      totalAdvances += a.amount;
    });

    const totalPaid = Number((totalPaidShifts + totalAdvances).toFixed(2));
    const totalUnpaid = Math.max(0, Number((totalWages - totalPaid).toFixed(2)));

    return {
      activeEmployeesCount: employees.filter((e) => e.isActive).length,
      totalEmployeesCount: employees.length,
      totalShiftsCount: shifts.length,
      totalAdvancesCount: advances.length,
      totalHours: Number(totalHours.toFixed(1)),
      totalWages: Number(totalWages.toFixed(2)),
      totalPaidShifts: Number(totalPaidShifts.toFixed(2)),
      totalAdvances: Number(totalAdvances.toFixed(2)),
      totalPaid,
      totalUnpaid,
    };
  },

  // 7. EXPORT / IMPORT / RESET
  exportBackup(): string {
    const backup: AdminBackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      masterItems: this.getMasterItems(),
      purchaseOrders: this.getPurchaseOrders(),
      dailySales: this.getDailySales(),
      debts: this.getDebts(),
      employees: this.getEmployees(),
      employeeShifts: this.getEmployeeShifts(),
      employeeAdvances: this.getEmployeeAdvances(),
    };
    return JSON.stringify(backup, null, 2);
  },

  downloadBackupJSON(): void {
    const jsonStr = this.exportBackup();
    const dateStr = new Date().toISOString().split('T')[0];
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasty-hilversum-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString) as AdminBackupData;
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'صيغة ملف النسخ الاحتياطي غير صالحة.' };
      }

      if (Array.isArray(data.masterItems)) {
        localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(data.masterItems));
      }
      if (Array.isArray(data.purchaseOrders)) {
        localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(data.purchaseOrders));
      }
      if (Array.isArray(data.dailySales)) {
        localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(data.dailySales));
      }
      if (Array.isArray(data.debts)) {
        localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(data.debts));
      }
      if (Array.isArray(data.employees)) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(data.employees));
      }
      if (Array.isArray(data.employeeShifts)) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify(data.employeeShifts));
      }
      if (Array.isArray(data.employeeAdvances)) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ADVANCES, JSON.stringify(data.employeeAdvances));
      }

      notifySubscribers();
      return { success: true, message: 'تم استرجاع البيانات بنجاح وتحديث كافة السجلات!' };
    } catch (e: any) {
      return { success: false, message: `فشل استيراد البيانات: ${e?.message || 'خطأ غير معروف'}` };
    }
  },

  resetToDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(INITIAL_MASTER_ITEMS));
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(DEMO_PURCHASE_ORDERS));
    localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(DEMO_DAILY_SALES));
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(DEMO_DEBTS));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify(DEMO_EMPLOYEE_SHIFTS));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ADVANCES, JSON.stringify(DEMO_EMPLOYEE_ADVANCES));
    notifySubscribers();
  },

  clearAllTransactionData(): void {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SHIFTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ADVANCES, JSON.stringify([]));
    notifySubscribers();
  },
};
