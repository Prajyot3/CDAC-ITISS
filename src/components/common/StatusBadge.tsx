import React from 'react';
import { ModuleStatus } from '../../types/module';

interface StatusBadgeProps {
  status: ModuleStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const isAvailable = status === 'AVAILABLE';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-medium',
    lg: 'text-sm px-3.5 py-1.5 font-semibold'
  }[size];

  if (isAvailable) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#76B900]/40 bg-[#76B900]/10 text-[#76B900] ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
        AVAILABLE
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#2B3540] bg-[#141B22] text-[#8C96A3] ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#525D6B]" />
      UPDATED SOON
    </span>
  );
};

