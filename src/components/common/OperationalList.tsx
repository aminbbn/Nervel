import React, { ReactNode } from 'react';

export interface OperationalListProps {
  children: ReactNode;
  className?: string;
}

export const OperationalList: React.FC<OperationalListProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`divide-y divide-[#18181C] border-y border-[#18181C] w-full ${className}`}>
      {children}
    </div>
  );
};
