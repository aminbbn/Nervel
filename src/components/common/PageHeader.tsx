import React, { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <div className={`border-b border-[#18181B] pb-6 mb-8 ${className}`}>
      {/* Optional Breadcrumb Trail */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-3" aria-label="مسیر راهنما">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {crumb.onClick && !isLast ? (
                  <button
                    onClick={crumb.onClick}
                    className="hover:text-[#F4F4F5] transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={isLast ? 'text-[#A1A1AA] font-medium' : ''}>
                    {crumb.label}
                  </span>
                )}
                {!isLast && <ChevronLeft className="h-3.5 w-3.5 text-[#3F3F46]" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Title Row & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#F4F4F5]">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">{actions}</div>}
      </div>
    </div>
  );
};
