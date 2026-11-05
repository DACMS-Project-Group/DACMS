const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary:
    'border-2 border-primary bg-transparent text-primary hover:bg-primary-lightest',
  subtle:
    'bg-primary-lightest text-dark hover:bg-primary-light hover:text-white',
  ghost: 'text-primary hover:bg-primary-lightest',
  danger: 'bg-error text-white hover:bg-error/90',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  unstyled = false,
  type,
  children,
  ...props
}) => (
  <Component
    type={
      Component === 'button'
        ? type ?? (unstyled ? undefined : 'button')
        : undefined
    }
    className={`inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
      unstyled
        ? ''
        : `rounded-xl font-inter font-semibold transition-colors ${
            VARIANTS[variant] ?? VARIANTS.primary
          } ${SIZES[size] ?? SIZES.md}`
    } ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export default Button;
