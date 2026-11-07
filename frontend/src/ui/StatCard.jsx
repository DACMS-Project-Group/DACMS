import Button from './Button';
import Card from '../components/Card';

const StatCard = ({ label, value, loading = false, actionLabel, onAction }) => (
  <Card className="flex h-full flex-col justify-between">
    <div>
      <p className="text-xs text-neutral font-inter md:text-sm">{label}</p>

      <p className="mt-2 whitespace-nowrap text-2xl font-bold text-primary-dark font-poppins md:text-3xl">
        {loading ? '—' : value}
      </p>
    </div>

    {actionLabel && (
      <Button
        variant="ghost"
        size="sm"
        aria-label={actionLabel}
        onClick={onAction}
        className="mt-3 self-start px-2"
      >
        {actionLabel} →
      </Button>
    )}
  </Card>
);

export default StatCard;
