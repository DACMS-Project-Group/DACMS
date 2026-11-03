import { useEffect, useRef } from 'react';
import Button from './Button';

/**
 * ConfirmDialog — controlled confirmation for destructive actions.
 *
 * Replaces `window.confirm` so confirmation can explain the consequence and
 * show a busy state while the request is in flight.
 */
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  busy = false,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onCancel?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    cancelRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-dark/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl"
      >
        <h2
          id="confirm-dialog-title"
          className="text-section font-poppins font-semibold text-dark"
        >
          {title}
        </h2>

        {description && (
          <p
            id="confirm-dialog-description"
            className="mt-2 text-body text-neutral font-inter"
          >
            {description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            ref={cancelRef}
            variant="secondary"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </Button>

          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Working...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
