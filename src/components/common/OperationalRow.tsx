import React, { ReactNode } from 'react';

export interface OperationalRowProps {
  /**
   * Right side: Columns 1–6 (on desktop)
   * Typically task title + repository/project metadata line below.
   */
  identity: ReactNode;

  /**
   * Center-left: Columns 7–9 (on desktop)
   * Typically status indicator + elapsed time or timestamp.
   */
  status?: ReactNode;

  /**
   * Left side: Columns 10–12 (on desktop)
   * Secondary action button, chevron, or deliverable link.
   */
  action?: ReactNode;

  /**
   * Click handler for the whole row
   */
  onClick?: () => void;

  className?: string;
}

export const OperationalRow: React.FC<OperationalRowProps> = ({
  identity,
  status,
  action,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`group w-full py-4.5 sm:py-5 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-md transition-colors ${
        onClick ? 'cursor-pointer hover:bg-[#0C0C10]' : ''
      } ${className}`}
    >
      {/* 12-column grid on desktop (lg+), responsive collapse on mobile/tablet */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
        {/* Columns 1–6: Task Identity (Right 50%) */}
        <div className="md:col-span-6 min-w-0">
          {identity}
        </div>

        {/* Columns 7–9: Status & Timestamp (25%) */}
        <div className="md:col-span-3 min-w-0 flex items-center md:justify-start">
          {status}
        </div>

        {/* Columns 10–12: Action / Chevron (Left 25%) */}
        <div className="md:col-span-3 min-w-0 flex items-center justify-start md:justify-end">
          {action}
        </div>
      </div>
    </div>
  );
};
