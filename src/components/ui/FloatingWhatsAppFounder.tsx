import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export interface FloatingWhatsAppFounderProps {
  label?: string;
}

export const FloatingWhatsAppFounder: React.FC<FloatingWhatsAppFounderProps> = ({
  label = 'Need help? Chat with LipaStay Founder',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const founderWhatsApp = '254700000000';
  const message = encodeURIComponent(
    'Habari LipaStay Founder! I am looking into LipaStay.co.ke. I have a question about direct M-Pesa bookings / listing my stay.'
  );

  const handleClick = () => {
    window.open(`https://wa.me/${founderWhatsApp}?text=${message}`, '_blank');
  };

  return (
    <aside aria-label="Founder Support Chat" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 group">
      {!isMinimized && (
        <button
          type="button"
          onClick={handleClick}
          className="hidden sm:flex items-center gap-2 bg-[#111111] text-white px-3.5 py-2 rounded-2xl shadow-xl border border-neutral-700 text-xs font-semibold hover:border-[#00A651] transition-all group-hover:scale-102"
        >
          <span className="w-2 h-2 rounded-full bg-[#00A651] animate-ping" />
          <span>{label}</span>
        </button>
      )}

      {/* Main WhatsApp Trigger Circle */}
      <button
        type="button"
        onClick={handleClick}
        title={label}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#00A651] text-white flex items-center justify-center shadow-2xl hover:bg-[#008e45] active:scale-95 transition-all duration-200 group-hover:shadow-[#00A651]/40 border-2 border-white"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF6B35] rounded-full border-2 border-white" />
      </button>
    </aside>
  );
};
