import React from 'react';
import { 
  Plus, 
  Menu, 
  Eye, 
  EyeOff, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TimePeriod } from '../../types/finance';
import { NotificationsPopover } from '../common/NotificationsPopover';

export const Header: React.FC = () => {
  const { 
    timePeriod, 
    setTimePeriod, 
    isPrivacyMode, 
    togglePrivacyMode,
    setIsMobileMenuOpen,
    openTransactionModal
  } = useFinance();

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Capitalize first letter of weekday
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const periods: { id: TimePeriod; label: string }[] = [
    { id: 'today', label: 'Hoje' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Este Mês' },
    { id: 'year', label: 'Ano' },
  ];

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-[#ECEEF4] sticky top-0 z-30 px-4 sm:px-8 py-4 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Greeting & Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#ECEEF4] text-[#24263A] hover:bg-slate-50"
              title="Abrir Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#24263A] tracking-tight">
                  Olá, Diego <span className="inline-block animate-pulse">👋</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#7565E8] bg-[#7565E8]/10 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Plano Pro
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9296A8] flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#9296A8]" />
                {capitalizedDate}
              </p>
            </div>
          </div>

          {/* Quick Actions on Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <NotificationsPopover />
            <button
              onClick={() => openTransactionModal()}
              className="p-2.5 bg-[#7565E8] text-white rounded-xl shadow-md shadow-[#7565E8]/20 flex items-center justify-center cursor-pointer active:scale-95"
              title="Nova Transação"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Period Filter, Privacy, Notifications, New Transaction */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Period Pills */}
          <div className="bg-[#F7F8FC] p-1 rounded-xl border border-[#ECEEF4] flex items-center text-xs font-semibold text-[#9296A8]">
            {periods.map(p => (
              <button
                key={p.id}
                onClick={() => setTimePeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timePeriod === p.id 
                    ? 'bg-white text-[#7565E8] shadow-xs font-bold border border-[#ECEEF4]' 
                    : 'hover:text-[#24263A]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Privacy Toggle (Hide values) */}
          <button
            onClick={togglePrivacyMode}
            className={`p-2.5 rounded-xl border border-[#ECEEF4] transition-all card-shadow cursor-pointer ${
              isPrivacyMode 
                ? 'bg-[#7565E8]/10 border-[#7565E8]/30 text-[#7565E8]' 
                : 'bg-white text-[#9296A8] hover:text-[#24263A]'
            }`}
            title={isPrivacyMode ? 'Mostrar valores' : 'Ocultar valores'}
          >
            {isPrivacyMode ? <EyeOff className="w-5 h-5 text-[#7565E8]" /> : <Eye className="w-5 h-5" />}
          </button>

          {/* Notifications on Desktop */}
          <div className="hidden lg:block">
            <NotificationsPopover />
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => openTransactionModal()}
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 bg-[#7565E8] hover:bg-[#6452e6] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#7565E8]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nova Transação</span>
          </button>
        </div>
      </div>
    </header>
  );
};
