import React from 'react';
import { TaskStatus } from '../../types';
import { StatusIndicator } from './StatusIndicator';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  return <StatusIndicator status={status} size={size} />;
};

export { StatusIndicator };
