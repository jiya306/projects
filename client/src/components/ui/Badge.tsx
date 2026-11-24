import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'muted' | 'outline' | 'tier';
  tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  tier,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  let style = 'bg-brand/20 text-text-primary border border-brand/40';

  if (tier) {
    switch (tier) {
      case 'PLATINUM':
        style = 'bg-slate-900 text-slate-100 border border-slate-700 font-mono tracking-wider';
        break;
      case 'GOLD':
        style = 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold';
        break;
      case 'SILVER':
        style = 'bg-zinc-200 text-zinc-800 border border-zinc-300';
        break;
      case 'BRONZE':
      default:
        style = 'bg-stone-100 text-stone-700 border border-stone-200';
        break;
    }
  } else {
    switch (variant) {
      case 'success':
        style = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
        break;
      case 'warning':
        style = 'bg-amber-50 text-amber-900 border border-amber-200';
        break;
      case 'muted':
        style = 'bg-surface-bone text-text-secondary border border-salon-border';
        break;
      case 'outline':
        style = 'bg-transparent text-text-body border border-salon-border';
        break;
      case 'brand':
      default:
        style = 'bg-brand-light/40 text-text-primary border border-brand/30';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full ${sizeStyles[size]} ${style} ${className}`}
    >
      {children}
    </span>
  );
};
