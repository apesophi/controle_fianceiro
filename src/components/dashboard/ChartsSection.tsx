import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  PieChart as PieIcon,
  ChevronDown
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { MONTHLY_CHART_DATA } from '../../data/mockData';

export const ChartsSection: React.FC = () => {
  const { transactions, categories, formatCurrency, summary } = useFinance();
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Calculate actual category expenses
  const categoryData = useMemo(() => {
    const expenseTotals: Record<string, number> = {};
    let totalExpense = 0;

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseTotals[t.category] = (expenseTotals[t.category] || 0) + t.amount;
        totalExpense += t.amount;
      });

    const categoryList = categories
      .filter(c => c.type === 'expense')
      .map(cat => {
        const spent = expenseTotals[cat.name] || 0;
        const percentage = totalExpense > 0 ? (spent / totalExpense) * 100 : 0;
        return {
          id: cat.id,
          name: cat.name,
          color: cat.color,
          spent,
          percentage: Math.round(percentage * 10) / 10
        };
      })
      .filter(c => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);

    return {
      items: categoryList,
      total: totalExpense
    };
  }, [transactions, categories]);

  // Main chart calculations
  const maxVal = Math.max(...MONTHLY_CHART_DATA.map(d => Math.max(d.income, d.expense))) * 1.15;
  const chartHeight = 220;
  const chartWidth = 540;

  // Generate SVG paths for smooth area curves
  const generateAreaPath = (key: 'income' | 'expense') => {
    const points = MONTHLY_CHART_DATA.map((d, i) => {
      const x = (i / (MONTHLY_CHART_DATA.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - (d[key] / maxVal) * chartHeight;
      return { x, y };
    });

    const linePath = points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = arr[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (point.x - prev.x) / 2;
      const cp2y = point.y;
      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
    }, '');

    const areaPath = `${linePath} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;

    return { linePath, areaPath, points };
  };

  const incomePaths = useMemo(() => generateAreaPath('income'), [maxVal]);
  const expensePaths = useMemo(() => generateAreaPath('expense'), [maxVal]);

  // Donut chart calculations
  const radius = 64;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  const donutSlices = categoryData.items.map(item => {
    const fraction = item.percentage / 100;
    const strokeDashoffset = circumference * (1 - fraction);
    const rotation = accumulatedAngle * 360;
    accumulatedAngle += fraction;
    return {
      ...item,
      strokeDasharray: `${circumference * fraction} ${circumference}`,
      strokeDashoffset: 0,
      rotation,
    };
  });

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Main Chart (8 cols): Receitas vs Despesas */}
      <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-[#ECEEF4] card-shadow flex flex-col justify-between">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#ECEEF4]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#24263A] tracking-tight">
                Fluxo de Caixa Mensal
              </h2>
              <span className="text-xs bg-[#16A67A]/10 text-[#16A67A] font-semibold px-2 py-0.5 rounded-full">
                Superávit +R$ 8.620
              </span>
            </div>
            <p className="text-xs text-[#9296A8] mt-0.5">
              Comparativo direto de entradas e saídas nos últimos 7 meses
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#16A67A]" />
                <span className="text-[#24263A]">Receitas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E56B75]" />
                <span className="text-[#24263A]">Despesas</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="bg-[#F7F8FC] p-0.5 rounded-lg border border-[#ECEEF4] flex items-center">
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  chartType === 'bar' ? 'bg-white text-[#7565E8] shadow-xs' : 'text-[#9296A8] hover:text-[#24263A]'
                }`}
                title="Gráfico em Barras"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  chartType === 'area' ? 'bg-white text-[#7565E8] shadow-xs' : 'text-[#9296A8] hover:text-[#24263A]'
                }`}
                title="Gráfico em Curvas"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart Visualization Area */}
        <div className="relative pt-6 pb-2 min-h-[260px] flex items-end">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-0 inset-y-6 flex flex-col justify-between pointer-events-none">
            {[20000, 15000, 10000, 5000, 0].map((v) => (
              <div key={v} className="flex items-center gap-3 w-full">
                <span className="text-[10px] text-[#9296A8] font-mono w-7 text-right shrink-0">
                  {v >= 1000 ? `${v / 1000}k` : v}
                </span>
                <div className="w-full border-b border-[#ECEEF4]/70" />
              </div>
            ))}
          </div>

          {/* Bar Chart Mode */}
          {chartType === 'bar' && (
            <div className="relative z-10 w-full pl-10 pr-2 flex items-end justify-between gap-2 sm:gap-4 h-[200px]">
              {MONTHLY_CHART_DATA.map((item, idx) => {
                const isHovered = hoveredMonthIndex === idx;
                const incomeHeight = (item.income / maxVal) * 190;
                const expenseHeight = (item.expense / maxVal) * 190;
                const netSavings = item.income - item.expense;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredMonthIndex(idx)}
                    onMouseLeave={() => setHoveredMonthIndex(null)}
                  >
                    {/* Hover Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-[95%] mb-2 left-1/2 -translate-x-1/2 bg-[#171A2B] text-white p-2.5 rounded-xl text-xs shadow-xl z-30 whitespace-nowrap border border-[#24283D] pointer-events-none animate-in fade-in zoom-in-95">
                        <div className="font-bold border-b border-[#24283D] pb-1 mb-1.5 flex items-center justify-between gap-4">
                          <span>{item.month} / 2026</span>
                          {item.projected && (
                            <span className="text-[9px] bg-[#7565E8] text-white px-1.5 py-0.2 rounded font-semibold">
                              Projetado
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex items-center justify-between gap-3 text-[#16A67A]">
                            <span>Receitas:</span>
                            <span className="font-bold">{formatCurrency(item.income)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-[#E56B75]">
                            <span>Despesas:</span>
                            <span className="font-bold">{formatCurrency(item.expense)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-[#5794D8] pt-1 border-t border-[#24283D]">
                            <span>Líquido:</span>
                            <span className="font-bold">{formatCurrency(netSavings)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bars pair */}
                    <div className="flex items-end gap-1 sm:gap-2 w-full justify-center">
                      {/* Income Bar */}
                      <div
                        style={{ height: `${incomeHeight}px` }}
                        className={`w-3.5 sm:w-5 bg-gradient-to-t from-[#16A67A] to-[#25D49E] rounded-t-md transition-all duration-300 ${
                          isHovered ? 'brightness-110 shadow-md shadow-[#16A67A]/30 scale-x-105' : 'opacity-90'
                        }`}
                      />
                      {/* Expense Bar */}
                      <div
                        style={{ height: `${expenseHeight}px` }}
                        className={`w-3.5 sm:w-5 bg-gradient-to-t from-[#E56B75] to-[#FA8992] rounded-t-md transition-all duration-300 ${
                          isHovered ? 'brightness-110 shadow-md shadow-[#E56B75]/30 scale-x-105' : 'opacity-90'
                        }`}
                      />
                    </div>

                    {/* Month Label */}
                    <span className={`text-xs mt-2 transition-colors ${
                      isHovered ? 'text-[#7565E8] font-bold' : 'text-[#9296A8] font-medium'
                    }`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Area Curve Mode */}
          {chartType === 'area' && (
            <div className="relative z-10 w-full pl-8 h-[200px] flex flex-col justify-end">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="area-income-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A67A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#16A67A" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="area-expense-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E56B75" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#E56B75" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area fills */}
                <path d={incomePaths.areaPath} fill="url(#area-income-grad)" />
                <path d={expensePaths.areaPath} fill="url(#area-expense-grad)" />

                {/* Smooth lines */}
                <path d={incomePaths.linePath} fill="none" stroke="#16A67A" strokeWidth="2.5" strokeLinecap="round" />
                <path d={expensePaths.linePath} fill="none" stroke="#E56B75" strokeWidth="2.5" strokeLinecap="round" />

                {/* Dots on points */}
                {incomePaths.points.map((pt, i) => (
                  <circle key={`inc-${i}`} cx={pt.x} cy={pt.y} r="3" fill="#16A67A" stroke="#FFFFFF" strokeWidth="2" />
                ))}
                {expensePaths.points.map((pt, i) => (
                  <circle key={`exp-${i}`} cx={pt.x} cy={pt.y} r="3" fill="#E56B75" stroke="#FFFFFF" strokeWidth="2" />
                ))}
              </svg>

              {/* Month labels at bottom */}
              <div className="flex justify-between pl-4 pr-3 pt-2">
                {MONTHLY_CHART_DATA.map(item => (
                  <span key={item.month} className="text-xs text-[#9296A8] font-medium">
                    {item.month}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side Chart (4 cols): Despesas por Categoria */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-[#ECEEF4] card-shadow flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF4]">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-[#7565E8]" />
            <h2 className="text-base font-bold text-[#24263A] tracking-tight">
              Despesas por Categoria
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#9296A8]">
            {categoryData.items.length} categorias
          </span>
        </div>

        {/* Donut Chart Center */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {donutSlices.map((slice) => {
                const isHovered = hoveredCategory === slice.name;
                return (
                  <circle
                    key={slice.id}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    style={{
                      transformOrigin: '80px 80px',
                      transform: `rotate(${slice.rotation}deg)`,
                      transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                      opacity: hoveredCategory && !isHovered ? 0.45 : 1
                    }}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(slice.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-[11px] font-semibold text-[#9296A8] uppercase tracking-wider">
                {hoveredCategory || 'Total Despesas'}
              </span>
              <span className="text-lg font-bold text-[#24263A] tracking-tight mt-0.5">
                {formatCurrency(
                  hoveredCategory 
                    ? (categoryData.items.find(c => c.name === hoveredCategory)?.spent || 0)
                    : categoryData.total
                )}
              </span>
              {hoveredCategory && (
                <span className="text-[11px] font-bold text-[#7565E8]">
                  {categoryData.items.find(c => c.name === hoveredCategory)?.percentage}% do total
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category breakdown legend list */}
        <div className="space-y-2 mt-1 max-h-[140px] overflow-y-auto pr-1">
          {categoryData.items.map((cat) => {
            const isHovered = hoveredCategory === cat.name;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                  isHovered ? 'bg-slate-50 font-semibold' : 'text-[#24263A]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate text-xs font-medium text-[#24263A]">
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[#9296A8] text-[11px] font-mono">
                    {cat.percentage}%
                  </span>
                  <span className="font-semibold text-xs text-[#24263A]">
                    {formatCurrency(cat.spent)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
