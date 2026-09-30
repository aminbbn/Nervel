import React, { ReactNode } from 'react';

export interface DividerProps {
  label?: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  label,
  className = '',
  orientation = 'horizontal',
}) => {
  if (orientation === 'vertical') {
    return <div className={`w-px bg-[#18181B] self-stretch ${className}`} />;
  }

  if (label) {
    return (
      <div className={`relative flex items-center w-full my-4 ${className}`}>
        <div className="grow border-t border-[#18181B]" />
        <span className="shrink mx-4 text-sm font-medium text-[#71717A]">
          {label}
        </span>
        <div className="grow border-t border-[#18181B]" />
      </div>
    );
  }

  return <hr className={`border-0 border-t border-[#18181B] w-full my-4 ${className}`} />;
};
