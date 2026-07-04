import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'neutral' | 'gold';
type BadgeSize = 'small' | 'medium';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'medium',
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span className={getBadgeClass(variant, size, className)}>
      {dot ? (
        <span className={getDotClass(variant)} aria-hidden="true" />
      ) : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

function getBadgeClass(
  variant: BadgeVariant,
  size: BadgeSize,
  className: string
) {
  const base =
    'inline-flex max-w-full items-center justify-center rounded-full border font-semibold';

  const variants = {
    success:
      'border-[var(--color-primary-light)] bg-[rgba(22,163,74,0.2)] text-[var(--color-primary-light)]',
    danger:
      'border-[var(--color-accent-light)] bg-[rgba(185,28,28,0.25)] text-[var(--color-accent-light)]',
    warning:
      'border-[var(--color-gold)] bg-[rgba(212,175,55,0.14)] text-[var(--color-gold-soft)]',
    neutral:
      'border-[var(--border)] bg-[rgba(255,255,255,0.08)] text-[var(--text-primary)]',
    gold: 'border-[var(--color-gold)] bg-[rgba(212,175,55,0.18)] text-[var(--color-gold)] shadow-[var(--shadow-glow-gold)]',
  };

  const sizes = {
    small: 'min-h-6 gap-1.5 px-2.5 text-xs',
    medium: 'min-h-8 gap-2 px-3 text-sm',
  };

  return [base, variants[variant], sizes[size], className].join(' ');
}

function getDotClass(variant: BadgeVariant) {
  const colors = {
    success: 'bg-[var(--color-primary-light)]',
    danger: 'bg-[var(--color-accent-light)]',
    warning: 'bg-[var(--color-gold)]',
    neutral: 'bg-[var(--text-muted)]',
    gold: 'bg-[var(--color-gold)]',
  };

  return ['size-2 rounded-full', colors[variant]].join(' ');
}
