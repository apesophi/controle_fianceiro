import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Check, 
  Building,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Bill } from '../../types/finance';

export const BillsPage: React.FC = () => {
  const { bills, addBill, deleteBill, toggleBillStatus, formatCurrency } = useFinance();
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New bill state
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState('Moradia & Contas');
  const [newInstitution, setNewInstitution] = useState('');
  const [newAutoDebit, setNewAutoDebit] = useState(false);

  const filteredBills = bills.filter(b => {
    if (filter === 'pending') return b.status === 'pending';
    if (filter === 'paid') return b.status === 'paid';
    return true;
  });

  const totalPending = bills
    .filter(b => b.status === 'pending')
    .reduce((acc, b) => acc + b.amount, 0);

  const totalPaid = bills
    .filter(b => b.status === 'paid')
    .reduce((acc, b) => acc + b.amount, 0);

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newAmount.replace(',', '.'));
    if (!newTitle.trim() || isNaN(val) || val <= 0 || !newDueDate) return;

    addBill({
      title: newTitle.trim(),
      amount: val,
      dueDate: newDueDate,
      category: newCategory,
      status: 'pending',
      institution: newInstitution.trim() || 'Geral',
      autoDebit: newAutoDebit
    });

    setNewTitle('');
    setNewAmount('');
    setNewDueDate('');
    setNewInstitution('');
    setNewAutoDebit(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#24263A] tracking-tight">
            Contas a Pagar & Obrigações
          </h1>
          <p className="text-sm text-[#9296A8] mt-0.5">
            Agende seus compromissos e evite multas ou atrasos
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7565E8] hover:bg-[#6452e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7565E8]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nova Conta</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#ECEEF4] card-shadow">
          <span className="text-xs font-semibold text-[#9296A8]">Total Pendente</span>
          <p className="text-2xl font-bold text-[#E56B75] mt-1 font-mono">
            {formatCurrency(totalPending)}
          </p>
          <span className="text-[11px] text-[#9296A8] mt-1 block">
            {bills.filter(b => b.status === 'pending').length} contas a liquidar
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#ECEEF4] card-shadow">
          <span className="text-xs font-semibold text-[#9296A8]">Total Pago no Mês</span>
          <p className="text-2xl font-bold text-[#16A67A] mt-1 font-mono">
            {formatCurrency(totalPaid)}
          </p>
          <span className="text-[11px] text-[#9296A8] mt-1 block">
            {bills.filter(b => b.status === 'paid').length} obrigações quitadas
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#ECEEF4] card-shadow">
          <span className="text-xs font-semibold text-[#9296A8]">Próximo Vencimento</span>
          <p className="text-2xl font-bold text-[#7565E8] mt-1 font-mono">
            05/11/2026
          </p>
          <span className="text-[11px] text-[#9296A8] mt-1 block">
            Aluguel & Condomínio Ed. Horizonte
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ECEEF4] pb-3 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filter === 'all' ? 'bg-[#7565E8] text-white' : 'text-[#9296A8] hover:text-[#24263A]'
          }`}
        >
          Todas ({bills.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filter === 'pending' ? 'bg-[#7565E8] text-white' : 'text-[#9296A8] hover:text-[#24263A]'
          }`}
        >
          Pendentes ({bills.filter(b => b.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filter === 'paid' ? 'bg-[#7565E8] text-white' : 'text-[#9296A8] hover:text-[#24263A]'
          }`}
        >
          Pagas ({bills.filter(b => b.status === 'paid').length})
        </button>
      </div>

      {/* Bills Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBills.map((bill) => {
          const isPaid = bill.status === 'paid';
          return (
            <div
              key={bill.id}
              className={`bg-white rounded-2xl p-5 border transition-all card-shadow flex items-center justify-between ${
                isPaid ? 'border-emerald-100 bg-emerald-50/20' : 'border-[#ECEEF4]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => toggleBillStatus(bill.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer ${
                    isPaid ? 'bg-[#16A67A] text-white' : 'border-2 border-[#ECEEF4] text-[#9296A8] hover:border-[#16A67A]'
                  }`}
                  title={isPaid ? 'Marcar como não pago' : 'Marcar como pago'}
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </button>

                <div className="min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${isPaid ? 'line-through text-[#9296A8]' : 'text-[#24263A]'}`}>
                    {bill.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#9296A8]">
                    <span>Vencimento: {new Date(bill.dueDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                    {bill.autoDebit && (
                      <span className="text-[10px] bg-[#7565E8]/10 text-[#7565E8] font-bold px-1.5 py-0.2 rounded">
                        Débito Automático
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-base font-bold font-mono ${isPaid ? 'text-[#9296A8]' : 'text-[#24263A]'}`}>
                  {formatCurrency(bill.amount)}
                </span>

                <button
                  onClick={() => deleteBill(bill.id)}
                  className="p-1.5 text-[#9296A8] hover:text-[#E56B75] rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Excluir conta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-backdrop">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-[#ECEEF4] shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#24263A] mb-1">Adicionar Nova Conta</h3>
            <p className="text-xs text-[#9296A8] mb-4">Cadastre uma fatura ou boleto para controle</p>

            <form onSubmit={handleCreateBill} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#9296A8] mb-1">Título da Conta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Condomínio, Energia, Seguro Auto"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#ECEEF4] rounded-xl text-xs sm:text-sm font-medium text-[#24263A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9296A8] mb-1">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0,00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#ECEEF4] rounded-xl text-xs sm:text-sm font-medium font-mono text-[#24263A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9296A8] mb-1">Data de Vencimento *</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#ECEEF4] rounded-xl text-xs sm:text-sm font-medium text-[#24263A]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autodebit"
                  checked={newAutoDebit}
                  onChange={(e) => setNewAutoDebit(e.target.checked)}
                  className="rounded text-[#7565E8] focus:ring-[#7565E8]"
                />
                <label htmlFor="autodebit" className="text-xs text-[#24263A] font-medium cursor-pointer">
                  Em débito automático no banco
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ECEEF4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#9296A8] hover:text-[#24263A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7565E8] hover:bg-[#6452e6] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Salvar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
