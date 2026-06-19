import React, { InputHTMLAttributes } from 'react';
import { AlertCircle } from './AppleIcon';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helpText,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 6)}`;
  
  return (
    <div className="w-full flex flex-col items-start">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--co-gray-1)] mb-1.5 select-none"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          w-full text-[15px] bg-[var(--co-surface-2)] text-[var(--apple-text)]
          border rounded-[10px] px-3.5 py-2.5 outline-none transition-all duration-200
          placeholder-[var(--co-gray-2)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]
          ${error 
            ? 'border-[var(--co-red)] focus:border-[var(--co-red)] focus:ring-[3px] focus:ring-[var(--co-red)]/15' 
            : 'border-[var(--co-gray-5)] focus:border-[var(--co-accent)] focus:ring-[3px] focus:ring-[var(--co-accent)]/20'
          }
          ${className}
        `}
        {...props}
      />
      {error ? (
        <p className="text-[13px] text-[var(--co-red)] mt-1.5 flex items-center gap-1.5 font-medium apple-fade-in">
          <AlertCircle size={12} className="shrink-0 text-[var(--co-red)]" />
          <span>{error}</span>
        </p>
      ) : helpText ? (
        <p className="text-[12px] text-[var(--co-gray-1)] mt-1.5">{helpText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
