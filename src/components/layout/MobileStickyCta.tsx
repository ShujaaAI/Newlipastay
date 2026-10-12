import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface MobileStickyCtaProps {
  label?: string;
  onClick: () => void;
}

export const MobileStickyCta: React.FC<MobileStickyCtaProps> = ({
  label = 'List Your Property - 0% Commission',
  onClick,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#EBE5DB] p-3 px-4 shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase font-bold text-[#FF6B35] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FF6B35]" />
          <span>Keep 100% Earnings</span>
        </div>
        <div className="text-xs font-black text-[#111111] truncate">
          0% Middleman Cuts
        </div>
      </div>

      <Button
        variant="mpesa"
        size="sm"
        onClick={onClick}
        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        className="font-bold text-xs py-2.5 px-3.5 shrink-0 shadow-sm"
      >
        {label}
      </Button>
    </div>
  );
};
