import React, { ReactNode } from 'react';

export interface SectionHeaderProps {
  title: string;
  count?: number | string;
  action?: ReactNode;
  semanticDot?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  count,
  action,
  semanticDot,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between pb-3 ${className}`}>
      {/* Right side: Section title + optional semantic dot + optional count */}
      <div className="flex items-center gap-2.5">
        {semanticDot && (
          <span className={`h-2 w-2 rounded-full shrink-0 ${semanticDot}`} />
        )}
        <h2 className="text-base sm:text-lg font-bold text-[#F4F4F5]">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-xs text-[#71717A] tabular-nums font-normal">
            ({count})
          </span>
        )}
      </div>

      {/* Left side: Optional secondary action link/button */}
      {action && (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#71717A] hover:text-[#F4F4F5] transition-colors">
          {action}
        </div>
      )}
    </div>
  );
};
