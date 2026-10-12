import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'mpesa' | 'warm' | 'dark' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'mpesa',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const variants = {
    mpesa: 'bg-[#EAF8F0] text-[#008440] border border-[#00A651]/25',
    warm: 'bg-[#FFF2EC] text-[#FF6B35] border border-[#FF6B35]/25',
    dark: 'bg-[#111111] text-white border border-[#111111]',
    neutral: 'bg-[#F4EFEA] text-[#4B5563] border border-[#EBE5DB]',
    outline: 'bg-transparent text-[#111111] border border-[#EBE5DB]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 leading-none select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
