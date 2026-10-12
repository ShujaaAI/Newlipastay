import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'mpesa' | 'dark' | 'warm' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'mpesa',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    mpesa:
      'bg-[#00A651] hover:bg-[#008e45] text-white shadow-sm hover:shadow focus-visible:ring-[#00A651]',
    dark:
      'bg-[#111111] hover:bg-[#262626] text-white shadow-sm hover:shadow focus-visible:ring-[#111111]',
    warm:
      'bg-[#FF6B35] hover:bg-[#e85b24] text-white shadow-sm hover:shadow focus-visible:ring-[#FF6B35]',
    outline:
      'bg-transparent border border-[#EBE5DB] text-[#111111] hover:bg-black/5 hover:border-[#111111] focus-visible:ring-[#111111]',
    ghost:
      'bg-transparent text-[#111111] hover:bg-black/5 focus-visible:ring-[#111111]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-[44px] rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 min-h-[48px] rounded-xl font-semibold gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
