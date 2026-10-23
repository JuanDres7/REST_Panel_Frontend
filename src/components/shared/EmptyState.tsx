import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {icon && (
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface-elevated text-text-muted">
          {icon}
        </div>
      )}
      <p className="mb-1 font-semibold text-text-primary">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
    </div>
  );
}
