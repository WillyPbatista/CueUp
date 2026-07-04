import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

type InputSize = 'small' | 'medium' | 'large';
type InputVariant = 'default' | 'error';

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'size' | 'className'
> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    helperText,
    error,
    size = 'medium',
    variant = 'default',
    fullWidth = false,
    disabled = false,
    className = '',
    inputClassName = '',
    leftIcon,
    rightIcon,
    onChange,
    ...props
  },
  ref
) {
  const inputId = id ?? props.name;
  const state = error ? 'error' : variant;
  const supportText = error ?? helperText;

  return (
    <label className={getRootClass(fullWidth, className)} htmlFor={inputId}>
      {label ? (
        <span className="text-xs font-medium text-gold">{label}</span>
      ) : null}

      <span className={getInputFrameClass(size, state, disabled)}>
        {leftIcon ? (
          <span className="flex shrink-0 items-center text-gold">
            {leftIcon}
          </span>
        ) : null}

        <input
          {...props}
          ref={ref}
          id={inputId}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value, event)}
          className={getInputClass(inputClassName)}
        />

        {rightIcon ? (
          <span className="flex shrink-0 items-center text-gold">
            {rightIcon}
          </span>
        ) : null}
      </span>

      {supportText ? (
        <span className={getSupportTextClass(Boolean(error))}>
          {supportText}
        </span>
      ) : null}
    </label>
  );
});

function getRootClass(fullWidth: boolean, className: string) {
  return [
    'flex flex-col gap-2',
    fullWidth ? 'w-full' : 'w-fit',
    className,
  ].join(' ');
}

function getInputFrameClass(
  size: InputSize,
  variant: InputVariant,
  disabled: boolean
) {
  const base =
    'flex items-center rounded border bg-[rgba(15,15,15,0.78)] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] transition focus-within:ring-2 disabled:opacity-50';

  const sizes = {
    small: 'min-h-9 w-56 gap-2 px-3 text-sm',
    medium: 'min-h-12 w-72 gap-3 px-4 text-base',
    large: 'min-h-14 w-96 gap-3 px-5 text-lg',
  };

  const variants = {
    default:
      'border-[var(--color-primary-light)] focus-within:border-[var(--color-gold)] focus-within:ring-[rgba(212,175,55,0.24)]',
    error:
      'border-[var(--color-accent-light)] focus-within:border-[var(--color-accent-light)] focus-within:ring-[rgba(239,68,68,0.22)]',
  };

  return [
    base,
    sizes[size],
    variants[variant],
    disabled ? 'cursor-not-allowed opacity-60' : '',
  ].join(' ');
}

function getInputClass(inputClassName: string) {
  return [
    'min-w-0 flex-1 bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed',
    inputClassName,
  ].join(' ');
}

function getSupportTextClass(hasError: boolean) {
  return [
    'text-xs',
    hasError ? 'text-[var(--color-accent-light)]' : 'text-[var(--text-muted)]',
  ].join(' ');
}
