import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Transaction, 
  Category, 
  Bill, 
  NotificationItem, 
  TimePeriod, 
  NavigationTab 
} from '../types/finance';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_BILLS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface FinanceSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlySavings: number;
  savingsRate: number;
  balanceGrowth: number;
  incomeGrowth: number;
  expenseGrowth: number;
  savingsGrowth: number;
}

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  bills: Bill[];
  notifications: NotificationItem[];
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  summary: FinanceSummary;
  formatCurrency: (amount: number, forceShow?: boolean) => string;
  addTransaction: (data: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBill: (data: Omit<Bill, 'id'>) => void;
  updateBill: (id: string, data: Partial<Bill>) => void;
  toggleBillStatus: (id: string) => void;
  deleteBill: (id: string) => void;
  updateCategoryBudget: (id: string, budgetLimit: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaults: () => void;
  isTransactionModalOpen: boolean;
  openTransactionModal: (txToEdit?: Transaction) => void;
  closeTransactionModal: () => void;
  editingTransaction: Transaction | null;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem('financeflow_transactions');
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem('financeflow_categories');
      return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const stored = localStorage.getItem('financeflow_bills');
      return stored ? JSON.parse(stored) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('financeflow_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // UI state
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    return localStorage.getItem('financeflow_privacy') === 'true';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modal state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('financeflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financeflow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('financeflow_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('financeflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('financeflow_privacy', String(isPrivacyMode));
  }, [isPrivacyMode]);

  const togglePrivacyMode = () => setIsPrivacyMode(prev => !prev);
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const openTransactionModal = (txToEdit?: Transaction) => {
    setEditingTransaction(txToEdit || null);
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(false);
  };

  // Format currency helper
  const formatCurrency = (amount: number, forceShow: boolean = false): string => {
    if (isPrivacyMode && !forceShow) {
      return '••••••••';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Summaries calculation
  const summary = useMemo<FinanceSummary>(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else if (t.type === 'expense') {
        expense += t.amount;
      }
    });

    const baseBalance = 24352.00; // Historical base savings
    const currentBalance = baseBalance + (income - expense);
    const savings = Math.max(0, income - expense);
    const rate = income > 0 ? (savings / income) * 100 : 0;

    return {
      totalBalance: currentBalance,
      totalIncome: income,
      totalExpense: expense,
      monthlySavings: savings,
      savingsRate: Math.round(rate),
      balanceGrowth: 12.4,
      incomeGrowth: 8.2,
      expenseGrowth: -3.1,
      savingsGrowth: 14.5,
    };
  }, [transactions]);

  // CRUD Actions
  const addTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}`,
      time: data.time || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBill = (data: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...data,
      id: `bill-${Date.now()}`
    };
    setBills(prev => [...prev, newBill]);
  };

  const updateBill = (id: string, data: Partial<Bill>) => {
    setBills(prev => prev.map(b => (b.id === id ? { ...b, ...data } : b)));
  };

  const toggleBillStatus = (id: string) => {
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'paid' ? 'pending' : 'paid';
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  const updateCategoryBudget = (id: string, budgetLimit: number) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, budgetLimit } : c));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDefaults = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(INITIAL_CATEGORIES);
    setBills(INITIAL_BILLS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem('financeflow_transactions');
    localStorage.removeItem('financeflow_categories');
    localStorage.removeItem('financeflow_bills');
    localStorage.removeItem('financeflow_notifications');
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        bills,
        notifications,
        timePeriod,
        setTimePeriod,
        activeTab,
        setActiveTab,
        isPrivacyMode,
        togglePrivacyMode,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        summary,
        formatCurrency,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBill,
        updateBill,
        toggleBillStatus,
        deleteBill,
        updateCategoryBudget,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaults,
        isTransactionModalOpen,
        openTransactionModal,
        closeTransactionModal,
        editingTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
