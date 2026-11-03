const TONES = {
  success: 'border-success/30 bg-status-done-soft text-status-done',
  error: 'border-error/30 bg-status-danger-soft text-status-danger',
  info: 'border-border-subtle bg-surface text-dark',
};

/**
 * Toast — transient feedback rendered in the bottom-right corner.
 *
 * Keep the message in local state and clear it with `onDismiss`; no provider
 * is needed for a single page-level message.
 */
const Toast = ({
  open = true,
  tone = 'success',
  title,
  message,
  onDismiss,
}) => {
  if (!open || (!title && !message)) return null;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={`fixed bottom-6 right-6 z-[60] flex w-[min(92vw,24rem)] items-start gap-3 rounded-xl border p-4 shadow-lg ${
        TONES[tone] ?? TONES.info
      }`}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <p className="text-card font-semibold font-inter">{title}</p>
        )}

        {message && (
          <p className={`text-body font-inter ${title ? 'mt-0.5' : ''}`}>
            {message}
          </p>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="-mr-1 -mt-1 rounded-lg p-1 text-lg leading-none opacity-70 transition hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Toast;
