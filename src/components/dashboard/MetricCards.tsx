import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkline } from '../common/Sparkline';

export const MetricCards: React.FC = () => {
  const { summary, formatCurrency } = useFinance();

  const cards = [
    {
      id: 'balance',
      title: 'Saldo Total',
      amount: summary.totalBalance,
      growth: '+12.4%',
      isPositive: true,
      comparison: 'vs. mês anterior',
      icon: Wallet,
      iconColor: '#7565E8',
      iconBg: '#7565E8]/10',
      sparklineColor: '#7565E8',
      sparklineData: [26500, 27800, 27200, 28900, 30100, 31200, summary.totalBalance],
      gradientId: 'grad-balance'
    },
    {
      id: 'income',
      title: 'Receitas',
      amount: summary.totalIncome,
      growth: '+8.2%',
      isPositive: true,
      comparison: 'vs. mês anterior',
      icon: TrendingUp,
      iconColor: '#16A67A',
      iconBg: '#16A67A]/10',
      sparklineColor: '#16A67A',
      sparklineData: [11200, 12400, 13100, 12900, 14200, 15400, summary.totalIncome],
      gradientId: 'grad-income'
    },
    {
      id: 'expense',
      title: 'Despesas',
      amount: summary.totalExpense,
      growth: '-3.1%',
      isPositive: true, // Lower expenses is positive!
      comparison: 'vs. mês anterior',
      icon: TrendingDown,
      iconColor: '#E56B75',
      iconBg: '#E56B75]/10',
      sparklineColor: '#E56B75',
      sparklineData: [6100, 6800, 7400, 6950, 7300, 7500, summary.totalExpense],
      gradientId: 'grad-expense'
    },
    {
      id: 'savings',
      title: 'Economia Mensal',
      amount: summary.monthlySavings,
      growth: '+14.5%',
      isPositive: true,
      comparison: `${summary.savingsRate}% da renda poupada`,
      icon: PiggyBank,
      iconColor: '#5794D8',
      iconBg: '#5794D8]/10',
      sparklineColor: '#5794D8',
      sparklineData: [5100, 5600, 5700, 5950, 6900, 7900, summary.monthlySavings],
      gradientId: 'grad-savings'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-5 border border-[#ECEEF4] card-shadow card-shadow-hover flex flex-col justify-between relative group transition-all"
          >
            {/* Top row: Icon & Title & Sparkline */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${card.iconColor}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.iconColor }} />
                </div>
                <span className="text-xs font-semibold text-[#9296A8] tracking-tight">
                  {card.title}
                </span>
              </div>

              {/* Sparkline */}
              <Sparkline 
                data={card.sparklineData} 
                color={card.sparklineColor}
                gradientId={card.gradientId}
                width={80}
                height={32}
              />
            </div>

            {/* Middle: Prominent Value */}
            <div className="my-1">
              <h3 className="text-2xl sm:text-[28px] font-bold text-[#24263A] tracking-tight font-sans">
                {formatCurrency(card.amount)}
              </h3>
            </div>

            {/* Bottom: Growth Badge & Comparative note */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#ECEEF4]/60">
              <span 
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md ${
                  card.isPositive 
                    ? 'bg-[#16A67A]/10 text-[#16A67A]' 
                    : 'bg-[#E56B75]/10 text-[#E56B75]'
                }`}
              >
                {card.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {card.growth}
              </span>
              <span className="text-[11px] text-[#9296A8] truncate font-medium">
                {card.comparison}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};
