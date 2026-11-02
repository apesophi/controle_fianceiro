import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const NotificationsPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { notifications, markNotificationRead, markAllNotificationsRead } = useFinance();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-[#E56B75]" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#16A67A]" />;
      default:
        return <Info className="w-4 h-4 text-[#5794D8]" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white border border-[#ECEEF4] text-[#24263A] hover:text-[#7565E8] hover:border-[#7565E8]/30 transition-all card-shadow flex items-center justify-center cursor-pointer"
        title="Notificações"
      >
        <Bell className="w-5 h-5 text-[#9296A8] hover:text-[#7565E8] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#E56B75] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl border border-[#ECEEF4] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 border-b border-[#ECEEF4] flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#24263A]">Notificações</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-[#7565E8]/10 text-[#7565E8] font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-[#7565E8] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#ECEEF4]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[#9296A8] text-sm">
                Nenhuma notificação no momento.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex gap-3 hover:bg-slate-50 ${
                    !notif.read ? 'bg-[#7565E8]/[0.03]' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs truncate ${!notif.read ? 'font-semibold text-[#24263A]' : 'font-medium text-[#24263A]'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#7565E8] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#9296A8] line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-[#9296A8]">
                      <Clock className="w-3 h-3" />
                      <span>{notif.date}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
