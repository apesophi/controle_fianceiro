import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowLeftRight, 
  DollarSign, 
  Calendar, 
  Tag, 
  CreditCard, 
  CheckCircle, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionType, TransactionStatus } from '../../types/finance';

export const TransactionModal: React.FC = () => {
  const { 
    isTransactionModalOpen, 
    closeTransactionModal, 
    editingTransaction, 
    addTransaction, 
    updateTransaction,
    categories 
  } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  const [paymentMethod, setPaymentMethod] = useState('Cartão Nubank Ultravioleta');
  const [status, setStatus] = useState<TransactionStatus>('completed');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter categories matching current transaction type
  const availableCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setTime(editingTransaction.time || '12:00');
      setPaymentMethod(editingTransaction.paymentMethod);
      setStatus(editingTransaction.status);
      setNotes(editingTransaction.notes || '');
    } else {
      setType('expense');
      setDescription('');
      setAmount('');
      setCategory(availableCategories[0]?.name || 'Alimentação & Mercado');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setPaymentMethod('Cartão Nubank Ultravioleta');
      setStatus('completed');
      setNotes('');
    }
    setErrorMessage('');
    setIsSuccess(false);
  }, [editingTransaction, isTransactionModalOpen]);

  // Adjust category if type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const validCats = categories.filter(c => c.type === newType);
    if (validCats.length > 0) {
      setCategory(validCats[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!description.trim()) {
      setErrorMessage('Por favor, informe uma descrição para o registro.');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Por favor, digite um valor monetário válido maior que zero.');
      return;
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        description: description.trim(),
        amount: numericAmount,
        type,
        category: category || (availableCategories[0]?.name || 'Geral'),
        date,
        time,
        paymentMethod,
        status,
        notes: notes.trim()
      });
    } else {
      addTransaction({
        description: description.trim(),
        amount: numericAmount,
        type,
        category: category || (availableCategories[0]?.name || 'Geral'),
        date,
        time,
        paymentMethod,
        status,
        notes: notes.trim()
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      closeTransactionModal();
    }, 600);
  };

  if (!isTransactionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-backdrop animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg border border-[#ECEEF4] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ECEEF4] flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-lg font-bold text-[#24263A] tracking-tight">
              {editingTransaction ? 'Editar Registro Financeiro' : 'Nova Transação'}
            </h3>
            <p className="text-xs text-[#9296A8]">
              {editingTransaction ? 'Atualize as informações do lançamento' : 'Adicione uma nova entrada, saída ou transferência'}
            </p>
          </div>
          <button
            onClick={closeTransactionModal}
            className="p-1.5 text-[#9296A8] hover:text-[#24263A] rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Type Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-[#9296A8] uppercase tracking-wider mb-2">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#F7F8FC] rounded-2xl border border-[#ECEEF4]">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-white text-[#E56B75] shadow-xs border border-[#ECEEF4]'
                    : 'text-[#9296A8] hover:text-[#24263A]'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Despesa
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  type === 'income'
                    ? 'bg-white text-[#16A67A] shadow-xs border border-[#ECEEF4]'
                    : 'text-[#9296A8] hover:text-[#24263A]'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                Receita
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('transfer')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  type === 'transfer'
                    ? 'bg-white text-[#5794D8] shadow-xs border border-[#ECEEF4]'
                    : 'text-[#9296A8] hover:text-[#24263A]'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                Transferência
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-[#9296A8] uppercase tracking-wider mb-1.5">
              Valor (R$) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base font-bold text-[#9296A8]">
                R$
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F7F8FC] border border-[#ECEEF4] rounded-2xl text-xl font-bold text-[#24263A] focus:outline-hidden focus:border-[#7565E8] focus:ring-2 focus:ring-[#7565E8]/10 transition-all font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#9296A8] uppercase tracking-wider mb-1.5">
              Descrição *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9296A8]">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Ex: Supermercado Pão de Açúcar, Salário, etc."
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-2xl text-sm font-medium text-[#24263A] focus:outline-hidden focus:border-[#7565E8] focus:ring-2 focus:ring-[#7565E8]/10 transition-all"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9296A8] uppercase tracking-wider mb-1.5">
                Categoria
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-2xl text-xs sm:text-sm font-medium text-[#24263A] focus:outline-hidden focus:border-[#7565E8] cursor-pointer appearance-none"
                >
                  {availableCategories.length > 0 ? (
                    availableCategories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))
                  ) : (
                    categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9296A8] uppercase tracking-wider mb-1.5">
                Conta / Meio de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-2xl text-xs sm:text-sm font-medium text-[#24263A] focus:outline-hidden focus:border-[#7565E8] cursor-pointer appearance-none"
              >
                <option value="Cartão Nubank Ultravioleta">Cartão Nubank Ultravioleta</option>
                <option value="Conta Corrente Itaú">Conta Corrente Itaú</option>
                <option value="Pix Banco Inter">Pix Banco Inter</option>
                <option value="XP Investimentos">XP Investimentos</option>
                <option value="Carteira Dinheiro">Carteira / Dinheiro Físico</option>
                <option value="Mercado Pago">Mercado Pago</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9296A8] uppercase tracking-wider mb-1.5">
                Data
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-2xl text-xs sm:text-sm font-medium text-[#24263A] focus:outline-hidden focus:border-[#7565E8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9296A8] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('completed')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                    status === 'completed'
                      ? 'bg-[#16A67A]/10 border-[#16A67A]/30 text-[#16A67A] font-bold'
                      : 'border-[#ECEEF4] text-[#9296A8] bg-[#F7F8FC]'
                  }`}
                >
                  Concluído
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('pending')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                    status === 'pending'
                      ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B] font-bold'
                      : 'border-[#ECEEF4] text-[#9296A8] bg-[#F7F8FC]'
                  }`}
                >
                  Pendente
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#9296A8] uppercase tracking-wider mb-1.5">
              Observações (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Referente ao reembolso da viagem..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-2xl text-xs sm:text-sm font-medium text-[#24263A] focus:outline-hidden focus:border-[#7565E8]"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#E56B75] flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-3 bg-[#16A67A]/10 border border-[#16A67A]/30 rounded-xl text-xs text-[#16A67A] flex items-center gap-2 font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Lançamento salvo com sucesso no FinanceFlow!</span>
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-3 border-t border-[#ECEEF4] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeTransactionModal}
              className="px-4 py-2.5 rounded-xl border border-[#ECEEF4] text-xs font-semibold text-[#9296A8] hover:text-[#24263A] hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#7565E8] hover:bg-[#6452e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7565E8]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {editingTransaction ? 'Atualizar Registro' : 'Confirmar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
