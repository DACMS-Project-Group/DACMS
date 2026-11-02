const TONES = {
  pending: 'bg-status-amber-soft text-status-amber',
  review: 'bg-status-progress-soft text-status-progress',
  done: 'bg-status-done-soft text-status-done',
  danger: 'bg-status-danger-soft text-status-danger',
};

const STATUS = {
  Pending: 'pending',
  Returned: 'pending',
  'In Review': 'review',
  'Under Review': 'review',
  'Approved by Lecturer': 'done',
  Verified: 'done',
  Approved: 'done',
  Paid: 'done',
  Rejected: 'danger',
  'Rejected by Lecturer': 'danger',
};

const StatusBadge = ({ status }) => {
  const label = String(status ?? '').trim() || 'Unknown';
  const tone = TONES[STATUS[label]] ?? 'bg-light-grey text-dark';

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-sm font-semibold ${tone}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
