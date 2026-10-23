import type { TextareaHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';
import { fieldClass, labelClass } from './field';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className={labelClass}>{label}</label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`${fieldClass} resize-y ${error ? 'border-coral' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-coral">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
