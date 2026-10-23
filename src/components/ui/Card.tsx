import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  /** Eleva la tarjeta al pasar el mouse. Usar cuando la tarjeta es clicable. */
  interactive?: boolean;
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', padding = 'md', interactive = false, ...props }: CardProps) {
  const hover = interactive
    ? 'cursor-pointer transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover'
    : '';

  return (
    <div
      className={`rounded-2xl border border-line bg-surface shadow-card ${hover} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
