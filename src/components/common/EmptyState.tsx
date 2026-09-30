import React, { ReactNode } from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-4 max-w-lg mx-auto ${className}`}
    >
      {icon && (
        <div className="h-12 w-12 rounded-lg bg-[#0E0E12] border border-[#1E1E24] flex items-center justify-center text-[#71717A] mb-4">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-bold text-[#F4F4F5] mb-1.5">{title}</h3>
      <p className="text-sm text-[#71717A] leading-relaxed mb-6">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
