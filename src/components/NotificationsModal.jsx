import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, CheckCircle2, Info } from 'lucide-react';

export const NotificationsModal = () => {
  const { notifications, isNotificationModalOpen, setIsNotificationModalOpen } = useApp();

  if (!isNotificationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 font-sans">
        
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="text-base font-extrabold text-purple-950">System Notifications</h3>
          </div>
          <button 
            onClick={() => setIsNotificationModalOpen(false)} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-start gap-3">
              <div className="p-2 rounded-xl mt-0.5 shrink-0 bg-purple-100 text-purple-700">
                {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-900">{n.title}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-purple-100">
          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold shadow-md shadow-purple-600/20"
          >
            Dismiss All
          </button>
        </div>

      </div>
    </div>
  );
};
