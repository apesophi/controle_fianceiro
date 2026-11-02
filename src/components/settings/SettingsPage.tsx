import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Mail, 
  Palette,
  Eye
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const SettingsPage: React.FC = () => {
  const { 
    isPrivacyMode, 
    togglePrivacyMode, 
    resetToDefaults,
    notifications
  } = useFinance();

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm('Deseja realmente restaurar os dados iniciais do FinanceFlow? Todas as alterações serão redefinidas para o modelo padrão.')) {
      resetToDefaults();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#24263A] tracking-tight">
          Configurações & Preferências
        </h1>
        <p className="text-sm text-[#9296A8] mt-0.5">
          Gerencie seu perfil, preferências visuais e opções do sistema
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECEEF4] card-shadow">
        <h2 className="text-base font-bold text-[#24263A] mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-[#7565E8]" />
          Perfil do Usuário
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7565E8] to-[#5794D8] flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-[#7565E8]/20">
              DO
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#16A67A] ring-2 ring-white" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#24263A]">Diego Oliveira</h3>
              <span className="text-xs bg-[#7565E8]/10 text-[#7565E8] font-bold px-2 py-0.5 rounded-full">
                Membro Premium
              </span>
            </div>
            <p className="text-xs text-[#9296A8] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              diego027oliveira@gmail.com
            </p>
            <p className="text-xs text-[#9296A8]">
              Plataforma: FinanceFlow Pro Edition
            </p>
          </div>
        </div>
      </div>

      {/* Preferences & Privacy */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECEEF4] card-shadow space-y-5">
        <h2 className="text-base font-bold text-[#24263A] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#7565E8]" />
          Privacidade & Visualização
        </h2>

        <div className="flex items-center justify-between py-3 border-b border-[#ECEEF4]">
          <div>
            <p className="text-sm font-semibold text-[#24263A]">Modo de Privacidade (Ocultar Saldos)</p>
            <p className="text-xs text-[#9296A8]">
              Mascarar valores monetários na tela para evitar olhares indesejados
            </p>
          </div>
          <button
            onClick={togglePrivacyMode}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isPrivacyMode ? 'bg-[#7565E8]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isPrivacyMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-[#ECEEF4]">
          <div>
            <p className="text-sm font-semibold text-[#24263A]">Moeda Padrão</p>
            <p className="text-xs text-[#9296A8]">
              Formato utilizado em todos os demonstrativos e cálculos
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-[#24263A]">
            Real Brasileiro (BRL - R$)
          </span>
        </div>
      </div>

      {/* Visual Identity Palette */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECEEF4] card-shadow">
        <h2 className="text-base font-bold text-[#24263A] mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#7565E8]" />
          Paleta Visual do FinanceFlow
        </h2>
        <p className="text-xs text-[#9296A8] mb-4">
          Cores institucionais e guias de estilo refinados
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-[#ECEEF4] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#7565E8] shrink-0" />
            <div>
              <span className="font-semibold block text-[#24263A]">Roxo Principal</span>
              <span className="text-[10px] text-[#9296A8] font-mono">#7565E8</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[#ECEEF4] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#16A67A] shrink-0" />
            <div>
              <span className="font-semibold block text-[#24263A]">Verde Positivo</span>
              <span className="text-[10px] text-[#9296A8] font-mono">#16A67A</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[#ECEEF4] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#E56B75] shrink-0" />
            <div>
              <span className="font-semibold block text-[#24263A]">Vermelho Negativo</span>
              <span className="text-[10px] text-[#9296A8] font-mono">#E56B75</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[#ECEEF4] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#171A2B] shrink-0" />
            <div>
              <span className="font-semibold block text-[#24263A]">Sidebar Dark</span>
              <span className="text-[10px] text-[#9296A8] font-mono">#171A2B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone / Reset */}
      <div className="bg-white rounded-2xl p-6 border border-red-100 card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#E56B75]">
              Redefinir Dados de Demonstração
            </h2>
            <p className="text-xs text-[#9296A8] mt-0.5">
              Restaure todas as transações, contas e categorias para o estado padrão do FinanceFlow
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#E56B75] text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar Dados Iniciais</span>
          </button>
        </div>

        {resetSuccess && (
          <p className="text-xs text-[#16A67A] font-semibold mt-3 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4" />
            Dados restaurados com sucesso para os valores padrão de demonstração!
          </p>
        )}
      </div>
    </div>
  );
};
