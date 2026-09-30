import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isTabular?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      isTabular = false,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className="w-full text-right">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#D4D4D8] mb-1.5 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-[#71717A]">
              {rightIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full h-11 bg-[#09090C] border transition-colors rounded-md text-[15px] sm:text-base text-[#F4F4F5] placeholder-[#52525B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] disabled:opacity-50 disabled:bg-[#070709] disabled:cursor-not-allowed ${
              error ? 'border-[#EF4444]' : 'border-[#27272A] hover:border-[#38383E]'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${leftIcon ? 'pl-10' : 'pl-3.5'} ${
              isTabular ? 'tabular-nums' : ''
            } ${className}`}
            {...props}
          />

          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#71717A]">
              {leftIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-[#71717A]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
