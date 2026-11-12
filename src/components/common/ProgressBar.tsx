import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string; // default green
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  size = 'md',
  color = '#76B900'
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs mb-1.5">
          {label && <span className="text-[#9CA3AF] font-medium">{label}</span>}
          {showPercent && <span className="text-[#F3F4F6] font-mono font-medium">{clampedValue}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#11161B] rounded-full overflow-hidden border border-[#222C35] ${heightClasses}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: color,
            boxShadow: clampedValue > 0 ? `0 0 8px ${color}66` : 'none'
          }}
        />
      </div>
    </div>
  );
};

