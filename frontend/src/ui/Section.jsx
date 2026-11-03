const Section = ({
  title,
  description,
  actions,
  children,
  className = '',
}) => (
  <section className={`mb-8 ${className}`}>
    {(title || actions) && (
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {title && (
            <h2 className="text-section font-poppins font-semibold text-primary">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-body text-neutral font-inter">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    )}

    {children}
  </section>
);

export default Section;
