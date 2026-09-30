import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, children, className = '', id, disabled, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className="w-full text-right">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[#D4D4D8] mb-1.5 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full h-11 bg-[#09090C] border transition-colors rounded-md text-[15px] sm:text-base text-[#F4F4F5] pr-3.5 pl-10 appearance-none focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] disabled:opacity-50 disabled:bg-[#070709] disabled:cursor-not-allowed cursor-pointer ${
              error ? 'border-[#EF4444]' : 'border-[#27272A] hover:border-[#38383E]'
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-[#0D0D11] text-[#F4F4F5]"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute left-3.5 pointer-events-none text-[#71717A]">
            <ChevronDown className="h-4 w-4" />
          </div>
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

Select.displayName = 'Select';
