import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SharpCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function SharpCard({ children, className, hover = false }: SharpCardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 border-t-4 border-t-blueprint-blue',
        hover && 'hover:shadow-lg transition-shadow cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
