const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-xl border border-border-subtle bg-surface p-4 shadow-sm md:p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
