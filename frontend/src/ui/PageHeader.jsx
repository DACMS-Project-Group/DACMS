const PageHeader = ({ title, description, actions, className = '' }) => (
  <div
    className={`mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between ${className}`}
  >
    <div>
      <h1 className="text-page font-poppins font-semibold text-primary">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-body text-neutral font-inter">{description}</p>
      )}
    </div>

    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
  </div>
);

export default PageHeader;
