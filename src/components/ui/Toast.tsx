import React from 'react';
import { MessageCircle, ShieldCheck, X } from 'lucide-react';

export interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-4 sm:right-6 z-[60] max-w-md bg-[#111111] text-white p-4 rounded-2xl shadow-2xl border border-[#00A651]/40 flex items-start gap-3 animate-in slide-in-from-top-4 duration-200">
      <div className="w-8 h-8 rounded-full bg-[#00A651] text-white flex items-center justify-center shrink-0">
        <MessageCircle className="w-4 h-4 fill-current" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#00A651] uppercase tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>WhatsApp Direct Tracking</span>
        </div>
        <p className="text-xs text-neutral-200 mt-0.5 leading-snug">{message}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
