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
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <div className="w-100 d-flex flex-column gap-1">
      {label && (
        <label htmlFor={inputId} className="form-label small fw-bold text-uppercase text-muted mb-0">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      />
      {error ? (
        <div className="invalid-feedback d-flex align-items-center gap-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      ) : helpText ? (
        <div className="form-text text-muted small">{helpText}</div>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
