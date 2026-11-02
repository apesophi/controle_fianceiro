import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, ArrowRight, Building, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const UpcomingBillsSection: React.FC = () => {
  const { bills, formatCurrency, toggleBillStatus, setActiveTab } = useFinance();

  // Pending bills sorted by due date
  const pendingBills = bills
    .filter(b => b.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const getDaysUntilDue = (dueDateStr: string) => {
    const today = new Date('2026-11-01');
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Venceu há ${Math.abs(diffDays)}d`, isUrgent: true };
    if (diffDays === 0) return { text: 'Vence hoje', isUrgent: true };
    if (diffDays === 1) return { text: 'Vence amanhã', isUrgent: true };
    return { text: `Vence em ${diffDays} dias`, isUrgent: diffDays <= 4 };
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ECEEF4] card-shadow flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ECEEF4]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#24263A] tracking-tight">
              Contas Próximas do Vencimento
            </h2>
            <span className="text-xs font-bold text-[#E56B75] bg-[#E56B75]/10 px-2 py-0.5 rounded-full">
              {pendingBills.length} pendente{pendingBills.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-[#9296A8] mt-0.5">
            Mantenha suas obrigações financeiras em dia sem juros
          </p>
        </div>
        <button
          onClick={() => setActiveTab('bills')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7565E8] hover:text-[#5a48dc] transition-colors p-1.5 rounded-lg hover:bg-[#7565E8]/5 cursor-pointer"
        >
          <span>Agenda completa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bills list */}
      <div className="divide-y divide-[#ECEEF4] my-2">
        {pendingBills.length === 0 ? (
          <div className="py-8 text-center text-[#16A67A] text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Todas as contas deste período estão em dia!
          </div>
        ) : (
          pendingBills.map((bill) => {
            const dueInfo = getDaysUntilDue(bill.dueDate);
            return (
              <div 
                key={bill.id} 
                className="py-3 flex items-center justify-between group hover:bg-[#F7F8FC]/60 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    dueInfo.isUrgent ? 'bg-[#E56B75]/10 text-[#E56B75]' : 'bg-[#5794D8]/10 text-[#5794D8]'
                  }`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#24263A] truncate">
                      {bill.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className={`font-semibold ${dueInfo.isUrgent ? 'text-[#E56B75]' : 'text-[#9296A8]'}`}>
                        {dueInfo.text}
                      </span>
                      {bill.autoDebit && (
                        <>
                          <span className="text-[#9296A8]">•</span>
                          <span className="text-[11px] text-[#7565E8] bg-[#7565E8]/10 px-1.5 rounded font-medium">
                            Débito Automático
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-[#24263A] font-mono">
                    {formatCurrency(bill.amount)}
                  </span>
                  <button
                    onClick={() => toggleBillStatus(bill.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#16A67A] bg-[#16A67A]/10 hover:bg-[#16A67A] hover:text-white rounded-lg transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Marcar como Pago"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pagar</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
