import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 py-3 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-blueprint-blue text-white hover:bg-blue-800': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600': variant === 'secondary',
          'border-2 border-blueprint-blue text-blueprint-blue hover:bg-blueprint-blue hover:text-white':
            variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
