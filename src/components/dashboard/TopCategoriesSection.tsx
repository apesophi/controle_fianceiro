import React from 'react';
import { PieChart, ArrowRight, AlertCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryIcon } from '../common/CategoryIcon';

export const TopCategoriesSection: React.FC = () => {
  const { transactions, categories, formatCurrency, setActiveTab } = useFinance();

  // Aggregate spending per category
  const categoryStats = React.useMemo(() => {
    const expenseTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseTotals[t.category] = (expenseTotals[t.category] || 0) + t.amount;
      });

    return categories
      .filter(c => c.type === 'expense')
      .map(cat => {
        const spent = expenseTotals[cat.name] || 0;
        const limit = cat.budgetLimit || 1;
        const progress = Math.min(100, Math.round((spent / limit) * 100));
        const isOverBudget = spent > limit;
        return {
          ...cat,
          spent,
          progress,
          isOverBudget
        };
      })
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 4);
  }, [transactions, categories]);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ECEEF4] card-shadow flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ECEEF4]">
        <div>
          <h2 className="text-base font-bold text-[#24263A] tracking-tight">
            Categorias & Orçamentos
          </h2>
          <p className="text-xs text-[#9296A8] mt-0.5">
            Acompanhamento de tetos de gastos mensais
          </p>
        </div>
        <button
          onClick={() => setActiveTab('categories')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7565E8] hover:text-[#5a48dc] transition-colors p-1.5 rounded-lg hover:bg-[#7565E8]/5 cursor-pointer"
        >
          <span>Ajustar limites</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Categories Progress List */}
      <div className="space-y-4 my-2">
        {categoryStats.map((cat) => (
          <div key={cat.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <CategoryIcon name={cat.icon} color={cat.color} className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-[#24263A]">{cat.name}</span>
                {cat.isOverBudget && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#E56B75] bg-[#E56B75]/10 px-1.5 py-0.2 rounded">
                    <AlertCircle className="w-3 h-3" />
                    Excedido
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="font-bold text-[#24263A]">
                  {formatCurrency(cat.spent)}
                </span>
                <span className="text-[#9296A8] text-[11px] ml-1">
                  / {formatCurrency(cat.budgetLimit)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-[#ECEEF4] overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${cat.progress}%`,
                  backgroundColor: cat.isOverBudget ? '#E56B75' : cat.color 
                }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#9296A8]">
              <span>{cat.progress}% do teto utilizado</span>
              <span>
                {cat.isOverBudget 
                  ? `Ultrapassou em ${formatCurrency(cat.spent - cat.budgetLimit)}`
                  : `Resta ${formatCurrency(cat.budgetLimit - cat.spent)}`
                }
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
