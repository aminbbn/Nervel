import React from 'react';
import { TaskStatus } from '../../types';

export type SemanticStatus =
  | TaskStatus
  | 'online'
  | 'offline'
  | 'busy'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral';

export interface StatusIndicatorProps {
  status: SemanticStatus;
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

interface StatusMeta {
  label: string;
  dotColor: string;
  pulse?: boolean;
}

const STATUS_DICTIONARY: Record<string, StatusMeta> = {
  // Customer-facing statuses strictly following specification
  queued: { label: 'در صف', dotColor: 'bg-[#71717A]' },
  running: { label: 'در حال اجرا', dotColor: 'bg-[#7C3AED]', pulse: true },
  assigning: { label: 'در صف', dotColor: 'bg-[#71717A]', pulse: true },
  waiting_for_customer: { label: 'منتظر شما', dotColor: 'bg-[#F59E0B]', pulse: true },
  validating: { label: 'در حال بررسی', dotColor: 'bg-[#71717A]', pulse: true },
  reassigning: { label: 'در حال بررسی', dotColor: 'bg-[#F59E0B]', pulse: true },
  completed: { label: 'تکمیل شد', dotColor: 'bg-[#10B981]' },
  failed: { label: 'ناموفق', dotColor: 'bg-[#EF4444]' },
  cancelled: { label: 'متوقف شد', dotColor: 'bg-[#52525B]' },
  error: { label: 'ناموفق', dotColor: 'bg-[#EF4444]' },

  // Generic & Operator statuses
  online: { label: 'آنلاین', dotColor: 'bg-[#10B981]' },
  offline: { label: 'آفلاین', dotColor: 'bg-[#52525B]' },
  busy: { label: 'در حال اجرا', dotColor: 'bg-[#7C3AED]', pulse: true },
  success: { label: 'تکمیل شد', dotColor: 'bg-[#10B981]' },
  warning: { label: 'منتظر شما', dotColor: 'bg-[#F59E0B]', pulse: true },
  neutral: { label: 'غیرفعال', dotColor: 'bg-[#71717A]' },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  pulse,
  className = '',
}) => {
  const meta = STATUS_DICTIONARY[status] || {
    label: String(status),
    dotColor: 'bg-[#71717A]',
  };

  const displayText = label || meta.label;
  const shouldPulse = pulse !== undefined ? pulse : meta.pulse;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center select-none font-normal ${
        isSmall ? 'text-[13px] gap-1.5' : 'text-sm gap-2'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {shouldPulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${meta.dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${meta.dotColor}`} />
      </span>
      <span className="text-[#A1A1AA] leading-none">{displayText}</span>
    </span>
  );
};
