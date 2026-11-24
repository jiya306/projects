import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'bone' | 'dark';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'white',
  hoverEffect = false,
  onClick,
}) => {
  const variantStyles = {
    white: 'bg-white text-text-primary border border-salon-border shadow-subtle',
    bone: 'bg-surface-bone text-text-primary border border-salon-border',
    dark: 'bg-surface-dark text-white border border-white/10 shadow-card',
  };

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 hover:border-brand/40 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-card p-6 ${variantStyles[variant]} ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
};
