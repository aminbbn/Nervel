import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-100 ease-out select-none whitespace-nowrap active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506] cursor-pointer';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-10 px-3.5 text-sm rounded-md gap-1.5',
    md: 'min-h-[44px] h-11 px-4.5 text-base rounded-md gap-2',
    lg: 'min-h-[48px] h-12 px-6 text-base rounded-lg gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#7C3AED] hover:bg-[#8B5CF6] active:bg-[#6D28D9] text-white focus-visible:ring-[#7C3AED]',
    secondary:
      'bg-[#101013] border border-[#27272A] hover:bg-[#18181C] hover:border-[#3F3F46] text-[#F4F4F5] focus-visible:ring-[#7C3AED]',
    ghost:
      'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#141418] active:bg-[#1A1A20] focus-visible:ring-[#7C3AED]',
    danger:
      'border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/10 active:bg-[#EF4444]/20 focus-visible:ring-[#EF4444]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          <span>{children}</span>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        </>
      )}
    </button>
  );
};
