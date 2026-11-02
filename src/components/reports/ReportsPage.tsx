import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Sparkles,
  Download
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { MONTHLY_CHART_DATA } from '../../data/mockData';

export const ReportsPage: React.FC = () => {
  const { summary, formatCurrency, transactions, categories } = useFinance();

  const handleDownloadReport = () => {
    alert('Relatório consolidado gerado! O download do demonstrativo em PDF foi iniciado.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#24263A] tracking-tight">
            Relatórios & Inteligência Financeira
          </h1>
          <p className="text-sm text-[#9296A8] mt-0.5">
            Análise aprofundada de rentabilidade, poupança e evolução patrimonial
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7565E8] hover:bg-[#6452e6] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Relatório Mensal</span>
        </button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#ECEEF4] card-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#9296A8]">Taxa de Poupança Média</span>
            <span className="p-2 bg-[#16A67A]/10 text-[#16A67A] rounded-xl">
              <PiggyBank className="w-5 h-5" />
            </span>
          </div>
          <p className="text-3xl font-bold text-[#24263A] font-sans">
            {summary.savingsRate}%
          </p>
          <p className="text-xs text-[#16A67A] font-semibold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +4.2% acima da recomendação de 50/30/20
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#ECEEF4] card-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#9296A8]">Lucro Líquido do Semestre</span>
            <span className="p-2 bg-[#7565E8]/10 text-[#7565E8] rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <p className="text-3xl font-bold text-[#24263A] font-mono">
            {formatCurrency(41770)}
          </p>
          <p className="text-xs text-[#7565E8] font-semibold mt-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Consistência positiva nos últimos 6 meses
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#ECEEF4] card-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#9296A8]">Índice de Saúde Financeira</span>
            <span className="p-2 bg-[#5794D8]/10 text-[#5794D8] rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
          </div>
          <p className="text-3xl font-bold text-[#24263A] font-sans">
            94 <span className="text-sm font-normal text-[#9296A8]">/ 100</span>
          </p>
          <p className="text-xs text-[#5794D8] font-semibold mt-2">
            Nível Excelente — Baixo endividamento e alta liquidez
          </p>
        </div>
      </div>

      {/* Historical Table */}
      <div className="bg-white rounded-2xl border border-[#ECEEF4] card-shadow p-6">
        <h2 className="text-base font-bold text-[#24263A] mb-1">
          Histórico Comparativo dos Últimos Períodos
        </h2>
        <p className="text-xs text-[#9296A8] mb-4">
          Detalhamento mês a mês com indicador de rentabilidade
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#ECEEF4] text-[#9296A8] text-[11px] font-bold uppercase">
                <th className="py-3 px-4">Mês</th>
                <th className="py-3 px-4">Receitas</th>
                <th className="py-3 px-4">Despesas</th>
                <th className="py-3 px-4">Economia Bruta</th>
                <th className="py-3 px-4 text-right">Taxa Poupança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEEF4]">
              {MONTHLY_CHART_DATA.map((row) => {
                const savingsRate = Math.round(((row.income - row.expense) / row.income) * 100);
                return (
                  <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#24263A]">{row.month} / 2026</td>
                    <td className="py-3.5 px-4 font-mono text-[#16A67A] font-semibold">
                      {formatCurrency(row.income)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#E56B75] font-semibold">
                      {formatCurrency(row.expense)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#24263A]">
                      {formatCurrency(row.income - row.expense)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-[#7565E8] bg-[#7565E8]/10 px-2 py-0.5 rounded-full text-xs">
                        {savingsRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
