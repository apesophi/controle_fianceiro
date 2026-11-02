import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType } from '../../types/finance';
import { CategoryIcon } from '../common/CategoryIcon';

export const TransactionsPage: React.FC = () => {
  const { 
    transactions, 
    categories, 
    formatCurrency, 
    deleteTransaction, 
    openTransactionModal 
  } = useFinance();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered & sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = 
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

        return matchesSearch && matchesType && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        } else {
          return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryDetails = (catName: string) => {
    return categories.find(c => c.name === catName) || {
      icon: 'Receipt',
      color: '#7565E8'
    };
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Data', 'Descrição', 'Categoria', 'Tipo', 'Valor (R$)', 'Forma de Pagamento', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.type,
      t.amount.toFixed(2),
      `"${t.paymentMethod}"`,
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinanceFlow_Extrato_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#24263A] tracking-tight">
            Transações & Extrato
          </h1>
          <p className="text-sm text-[#9296A8] mt-0.5">
            Gerencie e monitore cada entrada e saída do seu fluxo de caixa
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-[#ECEEF4] text-[#24263A] text-xs font-semibold rounded-xl card-shadow transition-all cursor-pointer"
            title="Exportar dados em CSV"
          >
            <Download className="w-4 h-4 text-[#9296A8]" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => openTransactionModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7565E8] hover:bg-[#6452e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7565E8]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nova Transação</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ECEEF4] card-shadow space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input (5 cols) */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9296A8]" />
            <input
              type="text"
              placeholder="Buscar por descrição, cartão ou categoria..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-xl text-xs sm:text-sm text-[#24263A] focus:outline-hidden focus:border-[#7565E8] transition-colors"
            />
          </div>

          {/* Type Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-xl text-xs font-medium text-[#24263A] focus:outline-hidden focus:border-[#7565E8] cursor-pointer"
            >
              <option value="all">Todos os Tipos</option>
              <option value="income">Receitas (+)</option>
              <option value="expense">Despesas (-)</option>
              <option value="transfer">Transferências</option>
            </select>
          </div>

          {/* Category Filter (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-xl text-xs font-medium text-[#24263A] focus:outline-hidden focus:border-[#7565E8] cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-[#F7F8FC] border border-[#ECEEF4] rounded-xl text-xs font-medium text-[#24263A] focus:outline-hidden focus:border-[#7565E8] cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="completed">Concluídos</option>
              <option value="pending">Pendentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modern Table Card */}
      <div className="bg-white rounded-2xl border border-[#ECEEF4] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ECEEF4] bg-[#F7F8FC]/60 text-[11px] font-bold text-[#9296A8] uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Transação / Categoria</th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-[#24263A] transition-colors select-none"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Data & Hora</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-4 hidden md:table-cell">Meio de Pagamento</th>
                <th className="py-3.5 px-4">Status</th>
                <th 
                  className="py-3.5 px-4 sm:px-6 text-right cursor-pointer hover:text-[#24263A] transition-colors select-none"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Valor</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center w-12">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#ECEEF4] text-xs sm:text-sm">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9296A8]">
                    Nenhuma transação correspondente aos filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const cat = getCategoryDetails(tx.category);
                  const isIncome = tx.type === 'income';

                  return (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-[#F7F8FC]/50 transition-colors group"
                    >
                      {/* Name & Category */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                            style={{ backgroundColor: `${cat.color}15` }}
                          >
                            <CategoryIcon name={cat.icon} color={cat.color} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#24263A] truncate max-w-[200px] sm:max-w-xs">
                              {tx.description}
                            </p>
                            <p className="text-[11px] text-[#9296A8] mt-0.5 truncate">
                              {tx.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#24263A]">
                        <div className="font-medium">
                          {new Date(tx.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-[11px] text-[#9296A8]">
                          {tx.time || '12:00'}
                        </div>
                      </td>

                      {/* Payment method */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-xs text-[#9296A8]">
                        <div className="flex items-center gap-1.5 font-medium text-[#24263A]">
                          <CreditCard className="w-3.5 h-3.5 text-[#9296A8]" />
                          <span>{tx.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            tx.status === 'completed'
                              ? 'bg-[#16A67A]/10 text-[#16A67A]'
                              : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                          }`}
                        >
                          {tx.status === 'completed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Concluído
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Pendente
                            </>
                          )}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <span 
                          className={`font-bold font-mono text-sm sm:text-base ${
                            isIncome ? 'text-[#16A67A]' : 'text-[#E56B75]'
                          }`}
                        >
                          {isIncome ? '+ ' : '- '}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center relative">
                        <div className="inline-block relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === tx.id ? null : tx.id)}
                            className="p-1.5 text-[#9296A8] hover:text-[#24263A] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === tx.id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-[#ECEEF4] py-1 z-30 animate-in fade-in zoom-in-95">
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  openTransactionModal(tx);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-[#24263A] hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#5794D8]" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  if (confirm('Deseja excluir este registro?')) {
                                    deleteTransaction(tx.id);
                                  }
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-[#E56B75] hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#E56B75]" />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-[#ECEEF4] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F7F8FC]/30">
          <p className="text-xs text-[#9296A8]">
            Mostrando <span className="font-semibold text-[#24263A]">{filteredTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a{' '}
            <span className="font-semibold text-[#24263A]">
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </span>{' '}
            de <span className="font-semibold text-[#24263A]">{filteredTransactions.length}</span> registros
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-[#ECEEF4] text-[#24263A] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Página Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold px-2 text-[#24263A]">
              {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-[#ECEEF4] text-[#24263A] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Próxima Página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
