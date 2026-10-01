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

export interface AdminCredentials {
  username: string;
  passwordHash: string; // plain or hashed string
  restaurantName: string;
  lastLogin?: string;
}

export interface AdminBackupData {
  version: string;
  exportedAt: string;
  masterItems: MasterItem[];
  purchaseOrders: PurchaseOrder[];
  dailySales: DailySalesRecord[];
  debts: DebtRecord[];
}
