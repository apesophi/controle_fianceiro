import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  CalendarClock, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  LogOut,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { NavigationTab } from '../../types/finance';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    toggleSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    bills
  } = useFinance();

  const pendingBillsCount = bills.filter(b => b.status === 'pending').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transações', icon: ArrowLeftRight },
    { id: 'categories', label: 'Orçamentos', icon: PieChart },
    { id: 'bills', label: 'Contas a Vencer', icon: CalendarClock, badge: pendingBillsCount },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleSelectTab = (id: NavigationTab) => {
    setActiveTab(id);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#171A2B] text-white flex flex-col transition-all duration-300 ease-in-out border-r border-[#24283D]
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-[#24283D]/70">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => handleSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7565E8] to-[#9B8DFC] flex items-center justify-center shrink-0 shadow-lg shadow-[#7565E8]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-white to-[#D5D2FB] bg-clip-text text-transparent">
                  FinanceFlow
                </span>
                <span className="text-[10px] tracking-wider uppercase text-[#9296A8] font-medium -mt-0.5">
                  Premium Fintech
                </span>
              </div>
            )}
          </div>

          {/* Close for mobile */}
          <button 
            className="lg:hidden text-[#9296A8] hover:text-white p-1 rounded-lg hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          <div className={`px-3 mb-2 text-[11px] font-semibold text-[#9296A8]/70 uppercase tracking-wider ${isSidebarCollapsed ? 'text-center' : ''}`}>
            {isSidebarCollapsed ? '•' : 'Menu Principal'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative
                  ${isActive 
                    ? 'bg-[#7565E8] text-white shadow-md shadow-[#7565E8]/30 font-semibold' 
                    : 'text-[#9296A8] hover:text-white hover:bg-white/[0.06]'
                  }
                  ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}
                `}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-[#9296A8] group-hover:text-white'}`} />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#E56B75]/20 text-[#E56B75]'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on collapse */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#171A2B] text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 border border-[#24283D]">
                    {item.label}
                    {item.badge ? ` (${item.badge})` : ''}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Pro Banner (when expanded) */}
        {!isSidebarCollapsed && (
          <div className="mx-3.5 mb-4 p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/[0.08] relative overflow-hidden">
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-[#7565E8]/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-white">
              <TrendingUp className="w-3.5 h-3.5 text-[#16A67A]" />
              <span>Poupança em Alta</span>
            </div>
            <p className="text-[11px] text-[#9296A8] leading-relaxed">
              Você poupou <span className="text-white font-medium">53%</span> da sua renda este mês. Continue assim!
            </p>
          </div>
        )}

        {/* User Profile & Collapse Toggle */}
        <div className="p-3 border-t border-[#24283D]/70 bg-[#141624]">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7565E8] to-[#5794D8] flex items-center justify-center font-semibold text-xs text-white border-2 border-[#171A2B]">
                  DO
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A67A] ring-2 ring-[#171A2B]" />
              </div>

              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">Diego Oliveira</span>
                  <span className="text-[11px] text-[#9296A8] truncate">diego027oliveira@gmail.com</span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            {!isSidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex p-1.5 text-[#9296A8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title="Recolher menu"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex w-full mt-3 p-1 text-[#9296A8] hover:text-white rounded-lg hover:bg-white/5 justify-center transition-colors"
              title="Expandir menu"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
