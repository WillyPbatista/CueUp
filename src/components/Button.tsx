import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={getButtonClass(
        variant,
        size,
        isDisabled,
        fullWidth,
        className
      )}
    >
      {loading ? (
        <span className={getSpinnerClass(size)} aria-hidden="true" />
      ) : (
        <>
          {leftIcon ? (
            <span className="shrink-0 text-gold">{leftIcon}</span>
          ) : null}
          <span className="truncate">{children}</span>
          {rightIcon ? (
            <span className="shrink-0 text-gold">{rightIcon}</span>
          ) : null}
        </>
      )}
    </button>
  );
}

function getButtonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  disabled: boolean,
  fullWidth: boolean,
  className: string
) {
  const base =
    'inline-flex items-center justify-center rounded-md border font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,175,55,0.35)]';

  const variants = {
    primary:
      'border-[var(--color-gold)] bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-dark)] text-[var(--text-primary)] shadow-[var(--shadow-glow-green)] hover:brightness-110',
    accent:
      'border-[var(--color-accent-light)] bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-[var(--text-primary)] shadow-[var(--shadow-glow-red)] hover:brightness-110',
    outline:
      'border-[var(--color-gold)] bg-transparent text-[var(--color-gold-soft)] hover:bg-[rgba(212,175,55,0.08)]',
    ghost:
      'border-transparent bg-transparent text-[var(--text-primary)] hover:border-[var(--border)] hover:bg-[rgba(255,255,255,0.06)]',
  };

  const sizes = {
    small: 'min-h-9 gap-1.5 px-3 text-sm',
    medium: 'min-h-12 gap-2 px-5 text-base',
    large: 'min-h-14 gap-2.5 px-7 text-lg',
  };

  return [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : 'w-fit',
    disabled ? 'cursor-not-allowed opacity-55 hover:brightness-100' : '',
    className,
  ].join(' ');
}

function getSpinnerClass(size: ButtonSize) {
  const sizes = {
    small: 'size-3',
    medium: 'size-4',
    large: 'size-5',
  };

  return [
    sizes[size],
    'rounded-full border-2 border-current border-t-transparent animate-spin',
  ].join(' ');
}
