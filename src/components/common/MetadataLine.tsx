import React, { ReactNode } from 'react';

export interface MetadataItem {
  icon?: ReactNode;
  label: ReactNode;
  isLtr?: boolean;
}

export interface MetadataLineProps {
  items: (MetadataItem | null | undefined | false | '')[];
  className?: string;
}

export const MetadataLine: React.FC<MetadataLineProps> = ({
  items,
  className = '',
}) => {
  const validItems = items.filter(Boolean) as MetadataItem[];

  if (validItems.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-[13px] text-[#71717A] ${className}`}>
      {validItems.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-[#3F3F46] select-none">·</span>}
          <span
            className={`inline-flex items-center gap-1.5 ${
              item.isLtr ? 'font-latin text-[#A1A1AA]' : ''
            }`}
            dir={item.isLtr ? 'ltr' : undefined}
          >
            {item.icon && <span className="text-[#52525B] shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};
