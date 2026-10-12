import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface MpesaTillVerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const MpesaTillVerifiedBadge: React.FC<MpesaTillVerifiedBadgeProps> = ({
  size = 'md',
  className = '',
  showText = true,
}) => {
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center font-bold text-[#008440] bg-[#EAF8F0] border border-[#00A651]/30 rounded-full shadow-2xs select-none ${sizes[size]} ${className}`}
      title="Verified Safaricom Buy Goods Till Number - Payments go 100% direct to host"
    >
      <ShieldCheck className={`${iconSizes[size]} text-[#00A651] stroke-[2.5] shrink-0`} />
      {showText && <span>M-Pesa Till Verified</span>}
    </span>
  );
};
