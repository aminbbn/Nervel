import React, { ReactNode } from 'react';

interface WorkspaceContainerProps {
  children: ReactNode;
  className?: string;
}

export const WorkspaceContainer: React.FC<WorkspaceContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 2xl:px-10 py-6 sm:py-8 pb-16 ${className}`}>
      {children}
    </div>
  );
};
