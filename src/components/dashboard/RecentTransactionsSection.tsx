import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Clock, 
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types/finance';
import { CategoryIcon } from '../common/CategoryIcon';

export const RecentTransactionsSection: React.FC = () => {
  const { 
    transactions, 
    categories, 
    formatCurrency, 
    deleteTransaction, 
    openTransactionModal,
    setActiveTab 
  } = useFinance();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const recentTransactions = transactions.slice(0, 6);

  const getCategoryDetails = (categoryName: string) => {
    return categories.find(c => c.name === categoryName) || {
      icon: 'Receipt',
      color: '#7565E8'
    };
  };

  const handleEdit = (tx: Transaction) => {
    setActiveMenuId(null);
    openTransactionModal(tx);
  };

  const handleDelete = (id: string) => {
    setActiveMenuId(null);
    if (confirm('Deseja realmente excluir esta transação?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ECEEF4] card-shadow flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ECEEF4]">
        <div>
          <h2 className="text-base font-bold text-[#24263A] tracking-tight">
            Transações Recentes
          </h2>
          <p className="text-xs text-[#9296A8] mt-0.5">
            Últimas movimentações registradas na sua conta
          </p>
        </div>
        <button
          onClick={() => setActiveTab('transactions')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7565E8] hover:text-[#5a48dc] transition-colors p-1.5 rounded-lg hover:bg-[#7565E8]/5 cursor-pointer"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transaction list */}
      <div className="divide-y divide-[#ECEEF4] my-2">
        {recentTransactions.length === 0 ? (
          <div className="py-12 text-center text-[#9296A8] text-sm">
            Nenhuma transação encontrada. Clique em "+ Nova Transação" para começar.
          </div>
        ) : (
          recentTransactions.map((tx) => {
            const cat = getCategoryDetails(tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div 
                key={tx.id} 
                className="py-3 sm:py-3.5 flex items-center justify-between group hover:bg-[#F7F8FC]/60 px-2 rounded-xl transition-all"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <CategoryIcon name={cat.icon} color={cat.color} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#24263A] truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[#9296A8]">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-[#9296A8]" />
                        {tx.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Date, Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p 
                      className={`text-sm font-bold tracking-tight font-mono ${
                        isIncome ? 'text-[#16A67A]' : 'text-[#E56B75]'
                      }`}
                    >
                      {isIncome ? '+ ' : '- '}
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[11px] text-[#9296A8] mt-0.5">
                      {new Date(tx.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      {tx.time ? ` às ${tx.time}` : ''}
                    </p>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === tx.id ? null : tx.id)}
                      className="p-1.5 text-[#9296A8] hover:text-[#24263A] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Opções"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === tx.id && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-[#ECEEF4] py-1 z-30 animate-in fade-in zoom-in-95">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#24263A] hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#5794D8]" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#E56B75] hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#E56B75]" />
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
