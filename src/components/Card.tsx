import type { ReactNode } from 'react';

type CardVariant = 'default' | 'highlight' | 'danger';
type CardPadding = 'none' | 'small' | 'medium' | 'large';

interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
}

export function Card({
  children,
  title,
  eyebrow,
  description,
  footer,
  variant = 'default',
  padding = 'medium',
  className = '',
}: CardProps) {
  const hasHeader = eyebrow || title || description;

  return (
    <section className={getCardClass(variant, padding, className)}>
      {hasHeader ? (
        <header className="flex flex-col gap-1.5">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-wide text-gold">
              {eyebrow}
            </span>
          ) : null}
          {title ? (
            <h2 className="text-xl font-bold text-[var(--color-gold-soft)]">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-sm text-[var(--text-muted)]">{description}</p>
          ) : null}
        </header>
      ) : null}

      <div>{children}</div>

      {footer ? (
        <footer className="border-t border-[var(--border)] pt-4">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

function getCardClass(
  variant: CardVariant,
  padding: CardPadding,
  className: string
) {
  const base =
    'flex flex-col gap-5 rounded-lg border backdrop-blur-sm transition duration-200';

  const variants = {
    default:
      'border-[var(--color-primary-light)] bg-[rgba(15,15,15,0.78)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]',
    highlight:
      'border-[var(--color-gold)] bg-[linear-gradient(145deg,rgba(22,101,52,0.3),rgba(15,15,15,0.86))] shadow-[var(--shadow-glow-gold)]',
    danger:
      'border-[var(--color-accent-light)] bg-[linear-gradient(145deg,rgba(185,28,28,0.25),rgba(15,15,15,0.86))] shadow-[var(--shadow-glow-red)]',
  };

  const paddings = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  return [base, variants[variant], paddings[padding], className].join(' ');
}
