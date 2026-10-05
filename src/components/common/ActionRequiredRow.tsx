import React, { ReactNode } from 'react';

export interface ActionRequiredRowProps {
  title: string;
  explanation: string;
  source?: ReactNode;
  statusLabel?: string;
  actionButton: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ActionRequiredRow: React.FC<ActionRequiredRowProps> = ({
  title,
  explanation,
  source,
  statusLabel = 'منتظر پاسخ شما',
  actionButton,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`group w-full py-5 sm:py-6 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-md transition-colors ${
        onClick ? 'cursor-pointer hover:bg-[#0C0C10]' : ''
      } ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
        {/* RIGHT 65–70% (Columns 1–8): Task identity & clear explanation */}
        <div className="lg:col-span-8 min-w-0 space-y-1.5">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-[#F4F4F5] leading-snug">
              {title}
            </h3>
          </div>

          <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-3xl">
            {explanation}
          </p>

          {source && (
            <div className="pt-0.5">
              {source}
            </div>
          )}
        </div>

        {/* LEFT 30–35% (Columns 9–12): Semantic amber indicator & Primary Contextual Action */}
        <div className="lg:col-span-4 min-w-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-2.5">
          {/* Subtle amber semantic dot - NO amber box, NO amber background */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#D4D4D8]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]" />
            </span>
            <span>{statusLabel}</span>
          </div>

          <div className="pt-1">
            {actionButton}
          </div>
        </div>
      </div>
    </div>
  );
};
