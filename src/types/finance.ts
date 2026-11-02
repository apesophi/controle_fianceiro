export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'completed' | 'pending';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  paymentMethod: string;
  status: TransactionStatus;
  notes?: string;
  recipient?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  icon: string;
  budgetLimit: number; // Monthly budget
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  category: string;
  status: 'pending' | 'paid' | 'overdue';
  autoDebit?: boolean;
  institution?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
}

export type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'all';

export type NavigationTab = 
  | 'dashboard' 
  | 'transactions' 
  | 'categories' 
  | 'bills' 
  | 'reports' 
  | 'settings';
