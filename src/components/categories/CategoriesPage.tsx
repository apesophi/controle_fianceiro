import React, { useState } from 'react';
import { 
  PieChart, 
  Plus, 
  Edit2, 
  Check, 
  AlertTriangle, 
  Sparkles,
  TrendingDown,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryIcon } from '../common/CategoryIcon';

export const CategoriesPage: React.FC = () => {
  const { categories, transactions, formatCurrency, updateCategoryBudget } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<string>('');

  // Calculate actual spending per category
  const expenseStats = React.useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      });

    return categories.map(cat => {
      const spent = totals[cat.name] || 0;
      const limit = cat.budgetLimit || 1;
      const percentage = Math.round((spent / limit) * 100);
      return {
        ...cat,
        spent,
        percentage,
        isOver: spent > limit
      };
    });
  }, [categories, transactions]);

  const startEdit = (id: string, currentLimit: number) => {
    setEditingId(id);
    setTempBudget(currentLimit.toString());
  };

  const saveEdit = (id: string) => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val >= 0) {
      updateCategoryBudget(id, val);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#24263A] tracking-tight">
            Categorias & Orçamentos Mensais
          </h1>
          <p className="text-sm text-[#9296A8] mt-0.5">
            Defina limites inteligentes de gastos para cada área da sua vida financeira
          </p>
        </div>
      </div>

      {/* Grid of category budget cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {expenseStats
          .filter(c => c.type === 'expense')
          .map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white rounded-2xl p-5 border border-[#ECEEF4] card-shadow card-shadow-hover flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <CategoryIcon name={cat.icon} color={cat.color} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#24263A]">{cat.name}</h3>
                      <span className="text-[11px] text-[#9296A8]">Orçamento mensal</span>
                    </div>
                  </div>

                  {cat.isOver && (
                    <span className="text-[10px] font-bold text-[#E56B75] bg-[#E56B75]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Acima do teto
                    </span>
                  )}
                </div>

                {/* Values Comparison */}
                <div className="my-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#9296A8] block">Gasto atual:</span>
                    <span className={`text-xl font-bold font-mono ${cat.isOver ? 'text-[#E56B75]' : 'text-[#24263A]'}`}>
                      {formatCurrency(cat.spent)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#9296A8] block">Limite planejado:</span>
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(e.target.value)}
                          className="w-24 px-2 py-1 text-xs border border-[#7565E8] rounded-lg font-mono font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(cat.id)}
                          className="p-1 bg-[#16A67A] text-white rounded-md hover:bg-emerald-600"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => startEdit(cat.id, cat.budgetLimit)}
                        className="text-base font-bold text-[#5794D8] font-mono cursor-pointer hover:underline flex items-center gap-1 justify-end"
                        title="Clique para editar teto"
                      >
                        <span>{formatCurrency(cat.budgetLimit)}</span>
                        <Edit2 className="w-3 h-3 text-[#9296A8]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-[#ECEEF4] overflow-hidden my-2">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, cat.percentage)}%`,
                      backgroundColor: cat.isOver ? '#E56B75' : cat.color 
                    }}
                  />
                </div>
              </div>

              {/* Card Footer status */}
              <div className="pt-3 border-t border-[#ECEEF4] flex items-center justify-between text-xs text-[#9296A8]">
                <span>{cat.percentage}% consumido</span>
                <span className="font-medium text-[#24263A]">
                  {cat.isOver 
                    ? `Excedido em ${formatCurrency(cat.spent - cat.budgetLimit)}` 
                    : `Disponível: ${formatCurrency(cat.budgetLimit - cat.spent)}`
                  }
                </span>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};
