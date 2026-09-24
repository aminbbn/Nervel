import React from 'react';
import { TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

interface StatusConfig {
  label: string;
  dotColor: string;
  pulse?: boolean;
}

const STATUS_CONFIGS: Record<TaskStatus, StatusConfig> = {
  running: {
    label: 'در حال اجرا',
    dotColor: 'bg-[#7C3AED]',
    pulse: true,
  },
  queued: {
    label: 'در صف زمان‌بندی',
    dotColor: 'bg-[#71717A]',
  },
  assigning: {
    label: 'در حال تخصیص',
    dotColor: 'bg-[#71717A]',
    pulse: true,
  },
  waiting_for_customer: {
    label: 'منتظر پاسخ شما',
    dotColor: 'bg-[#F59E0B]',
    pulse: true,
  },
  validating: {
    label: 'بررسی کیفی QA',
    dotColor: 'bg-[#71717A]',
    pulse: true,
  },
  reassigning: {
    label: 'انتقال به ورکر جدید',
    dotColor: 'bg-[#71717A]',
    pulse: true,
  },
  completed: {
    label: 'تکمیل‌شده',
    dotColor: 'bg-[#10B981]',
  },
  cancelled: {
    label: 'لغوشده',
    dotColor: 'bg-[#52525B]',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.queued;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center select-none font-normal ${
        isSmall ? 'text-[13px] gap-1.5' : 'text-sm gap-2'
      }`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`} />
      </span>
      <span className="text-[#A1A1AA]">{config.label}</span>
    </span>
  );
};
