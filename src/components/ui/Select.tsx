import type { SelectHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { fieldClass, labelClass } from './field';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className={labelClass}>{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`${fieldClass} cursor-pointer appearance-none pr-10 ${error ? 'border-coral' : ''} ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
        </div>
        {error && <p className="text-xs text-coral">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
