export type ItemCategory = 
  | 'meat' 
  | 'vegetables' 
  | 'bread' 
  | 'dry_goods' 
  | 'dairy_sauces' 
  | 'packaging' 
  | 'drinks' 
  | 'other';

export type ItemUnit = 
  | 'kg' 
  | 'box' 
  | 'bag' 
  | 'pack' 
  | 'piece' 
  | 'liter';

export interface MasterItem {
  id: string;
  name: string;
  category: ItemCategory;
  unit: ItemUnit;
  defaultQty?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  masterItemId: string;
  name: string;
  category: ItemCategory;
  unit: ItemUnit;
  quantity: number;
  notes?: string;
  isPurchased: boolean;
  purchasedAt?: string;
}

export type OrderStatus = 'pending' | 'completed';

export interface PurchaseOrder {
  id: string;
  orderNumber: string; // e.g. #ORD-2026-001
  title: string;
  date: string; // YYYY-MM-DD
  status: OrderStatus;
  items: OrderItem[];
  notes?: string;
  completedAt?: string;
  createdAt: string;
}

export interface DailySalesRecord {
  id: string;
  date: string; // YYYY-MM-DD
  cashAmount: number; // in EUR
  cardAmount: number; // in EUR
  totalAmount: number; // cash + card
  cashPercentage: number; // %
  cardPercentage: number; // %
  notes?: string;
  recordedAt: string;
}

export type DebtType = 'payable' | 'receivable'; 
// payable: دين علينا (للموردين أو التزامات)
// receivable: دين لنا (على الزبائن أو جهات خارجية)

export type DebtStatus = 'unpaid' | 'partially_paid' | 'paid';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'pin';

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: PaymentMethod;
  note?: string;
  createdAt: string;
}

export interface DebtRecord {
  id: string;
  partyName: string;
  type: DebtType;
  phone?: string;
  category?: 'supplier' | 'customer' | 'maintenance' | 'other';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: DebtStatus;
  createdDate: string;
  dueDate?: string;
  description?: string;
  payments: DebtPayment[];
}

export type UserRole = 'admin' | 'manager';

export interface CurrentUser {
  username: string;
  displayName: string;
  role: UserRole;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // plain or hashed string
  restaurantName: string;
  lastLogin?: string;
  managerUsername?: string;
  managerPasswordHash?: string;
}

export type WageType = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type ScheduleType = 'fixed' | 'flexible';

export interface Employee {
  id: string;
  name: string;
  phone?: string;
  role: string; // e.g. معلم شاورما، كاشير، مساعد مطبخ، شيف معجنات
  wageType: WageType;
  rate: number; // default hourly, daily, or weekly rate in EUR
  scheduleType: ScheduleType; // 'fixed' = دوام ثابت | 'flexible' = دوام مرن
  defaultHours?: number; // e.g. 8 (hours per shift)
  defaultStartTime?: string; // e.g. "10:00"
  defaultEndTime?: string; // e.g. "18:30"
  defaultBreakMinutes?: number; // e.g. 30
  workingDays?: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  isActive: boolean;
  startDate?: string;
  notes?: string;
  createdAt: string;
}

export type ShiftPaymentStatus = 'paid_cash' | 'paid_bank' | 'unpaid';

export interface EmployeeShift {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakMinutes: number; // break in minutes
  totalHours: number; // calculated net hours (e.g. 7.50)
  hourlyRate: number; // EUR per hour or per day/week depending on wageType
  wageType?: WageType; // 'hourly' | 'daily' | 'weekly' | 'monthly'
  totalEarned: number; // total EUR for this shift
  paymentStatus: ShiftPaymentStatus;
  paidAmount: number; // amount paid
  notes?: string;
  createdAt: string;
}

export type EmployeePaymentType = 'advance' | 'salary_settlement' | 'bonus' | 'other';
export type EmployeePaymentMethod = 'cash' | 'bank_transfer';

export interface EmployeeAdvance {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number; // in EUR (e.g. 50.00)
  date: string; // YYYY-MM-DD
  paymentMethod: EmployeePaymentMethod; // cash | bank_transfer
  paymentType: EmployeePaymentType; // advance | salary_settlement | bonus | other
  notes?: string; // e.g. سلفة من الكاش، سحب على الحساب
  createdAt: string;
}

export interface AdminBackupData {
  version: string;
  exportedAt: string;
  masterItems: MasterItem[];
  purchaseOrders: PurchaseOrder[];
  dailySales: DailySalesRecord[];
  debts: DebtRecord[];
  employees?: Employee[];
  employeeShifts?: EmployeeShift[];
  employeeAdvances?: EmployeeAdvance[];
}
