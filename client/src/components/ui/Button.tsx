import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 min-h-[36px] gap-1.5',
    md: 'text-sm px-6 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-8 py-3.5 min-h-[50px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-brand text-text-primary hover:bg-brand-hover shadow-subtle hover:shadow-glow font-semibold',
    secondary:
      'bg-surface-dark text-white hover:bg-black hover:shadow-subtle',
    outline:
      'border border-salon-border text-text-primary bg-transparent hover:bg-surface-bone',
    ghost:
      'text-text-primary bg-transparent hover:bg-surface-bone/80',
    danger:
      'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
