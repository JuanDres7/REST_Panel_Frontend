import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Algo salió mal', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-coral-light">
        <AlertTriangle className="h-9 w-9 text-coral" />
      </div>
      <p className="mb-4 max-w-md text-text-secondary">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
