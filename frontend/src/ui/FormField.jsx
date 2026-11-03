export const inputClass =
  'w-full rounded-xl border border-neutral/40 bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25';

const FormField = ({
  id,
  label,
  hint,
  error,
  required = false,
  className = '',
  children,
}) => (
  <div className={className}>
    {label && (
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-dark font-inter"
      >
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
    )}

    {children}

    {error ? (
      <p className="mt-1 text-xs text-error font-inter">{error}</p>
    ) : hint ? (
      <p className="mt-1 text-xs text-neutral font-inter">{hint}</p>
    ) : null}
  </div>
);

export default FormField;
