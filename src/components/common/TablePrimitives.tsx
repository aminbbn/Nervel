import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export const Table: React.FC<HTMLAttributes<HTMLTableElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full text-right text-sm border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <thead className={`border-b border-[#18181B] bg-transparent ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <tbody className={`divide-y divide-[#18181B] ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<HTMLAttributes<HTMLTableRowElement> & { isInteractive?: boolean }> = ({
  className = '',
  isInteractive = true,
  children,
  ...props
}) => (
  <tr
    className={`border-b border-[#18181B] transition-colors ${
      isInteractive ? 'hover:bg-[#0D0D10] cursor-pointer' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <th
    className={`py-3.5 px-4 text-sm font-medium text-[#71717A] select-none ${className}`}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<TdHTMLAttributes<HTMLTableCellElement> & { isTabular?: boolean }> = ({
  className = '',
  isTabular = false,
  children,
  ...props
}) => (
  <td
    className={`py-4 px-4 text-sm text-[#D4D4D8] align-middle ${
      isTabular ? 'tabular-nums' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </td>
);

export interface ListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  metadata?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  isInteractive?: boolean;
}

export const ListRow: React.FC<ListRowProps> = ({
  title,
  subtitle,
  metadata,
  action,
  icon,
  isInteractive = true,
  className = '',
  ...props
}) => (
  <div
    className={`flex items-center justify-between p-4 border-b border-[#18181B] transition-colors ${
      isInteractive ? 'hover:bg-[#0C0C0F] cursor-pointer' : ''
    } ${className}`}
    {...props}
  >
    <div className="flex items-center gap-3.5 min-w-0">
      {icon && <div className="text-[#71717A] shrink-0">{icon}</div>}
      <div className="min-w-0">
        <div className="text-[15px] font-medium text-[#F4F4F5] truncate">{title}</div>
        {subtitle && <div className="text-xs text-[#71717A] mt-0.5 truncate">{subtitle}</div>}
      </div>
    </div>

    <div className="flex items-center gap-4 shrink-0">
      {metadata && <div className="text-xs text-[#71717A]">{metadata}</div>}
      {action && <div>{action}</div>}
    </div>
  </div>
);
