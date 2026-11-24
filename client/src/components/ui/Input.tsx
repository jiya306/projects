import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-full bg-white border border-salon-border px-5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand min-h-[44px] ${
            leftIcon ? 'pl-11' : ''
          } ${rightIcon ? 'pr-11' : ''} ${error ? 'border-rose-400 focus:ring-rose-400' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-500 pl-2">{error}</p>}
      {!error && helperText && <p className="text-xs text-text-muted pl-2">{helperText}</p>}
    </div>
  );
};
