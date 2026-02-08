import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-bold',
        {
          'bg-gray-200 text-gray-800': variant === 'default',
          'bg-blueprint-blue text-white': variant === 'primary',
          'bg-green-500 text-white': variant === 'success',
          'bg-yellow-500 text-white': variant === 'warning',
          'bg-red-500 text-white': variant === 'error',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
