import { useEffect, type ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  children: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  open: boolean;
  onClose: () => void;
}

export function Modal({
  children,
  title,
  description,
  footer,
  open,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Close modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />

      <section className="relative z-10 flex w-full max-w-lg flex-col gap-5 rounded-lg border border-[var(--color-gold)] bg-[linear-gradient(145deg,rgba(22,101,52,0.2),rgba(15,15,15,0.96))] p-6 shadow-[var(--shadow-glow-gold)]">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-bold text-[var(--color-gold-soft)]">
              {title}
            </h2>
            {description ? (
              <p className="text-sm leading-6 text-[var(--text-muted)]">
                {description}
              </p>
            ) : null}
          </div>

          <Button
            aria-label="Close modal"
            onClick={onClose}
            size="small"
            type="button"
            variant="ghost"
          >
            X
          </Button>
        </header>

        <div>{children}</div>

        {footer ? (
          <footer className="border-t border-[var(--border)] pt-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}
