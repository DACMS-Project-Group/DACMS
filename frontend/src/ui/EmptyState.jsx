const EmptyState = ({ title, description, action, className = '' }) => (
  <div className={`py-10 text-center ${className}`}>
    <p className="font-semibold text-dark font-inter">{title}</p>

    {description && (
      <p className="mt-1 text-body text-neutral font-inter">{description}</p>
    )}

    {action && <div className="mt-4 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
