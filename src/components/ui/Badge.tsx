import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  className?: string;
}

const variantStyles = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
      ${variantStyles[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const variants: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    'Easy': 'success',
    'Moderate': 'info',
    'Challenging': 'warning',
    'Hard': 'error',
  };

  return (
    <Badge variant={variants[difficulty] || 'default'}>
      {difficulty}
    </Badge>
  );
}
