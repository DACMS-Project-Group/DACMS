import { STATUS_TONES } from '../lib/statuses';

const StatusBadge = ({ status }) => {
  const label = String(status ?? '').trim() || 'Unknown';
  const tone = STATUS_TONES[label] ?? 'bg-light-grey text-dark';

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-sm font-semibold ${tone}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
