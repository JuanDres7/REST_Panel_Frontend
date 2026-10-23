import type { InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';
import { fieldClass, labelClass } from './field';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className={labelClass}>{label}</label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${fieldClass} ${error ? 'border-coral' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-coral">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
