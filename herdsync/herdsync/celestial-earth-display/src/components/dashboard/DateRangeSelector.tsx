import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DateRangeSelectorProps {
  value: number;
  onChange: (days: number) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const options = [
    { label: 'Today', value: 1 },
    { label: '3 Days', value: 3 },
    { label: '7 Days', value: 7 },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Time Range:</span>
      <div className="flex rounded-lg border border-border overflow-hidden">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-all',
              value === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
