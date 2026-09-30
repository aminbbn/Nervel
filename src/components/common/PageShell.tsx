import React, { ReactNode } from 'react';

export interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export const PageShell: React.FC<PageShellProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 2xl:px-10 py-6 sm:py-8 animate-nervel-enter ${className}`}
    >
      {children}
    </div>
  );
};
