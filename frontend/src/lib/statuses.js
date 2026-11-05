export const APPLICATION_STATUS_OPTIONS = [
  'Pending',
  'In Review',
  'Approved',
  'Rejected',
  'Returned',
];

export const CLAIM_STATUS_OPTIONS = [
  'Pending',
  'Under Review',
  'Approved by Lecturer',
  'Verified',
  'Approved',
  'Paid',
  'Rejected by Lecturer',
  'Rejected',
];

export const STATUS_TONES = {
  Pending: 'bg-status-amber-soft text-status-amber',
  Returned: 'bg-status-amber-soft text-status-amber',
  'In Review': 'bg-status-progress-soft text-status-progress',
  'Under Review': 'bg-status-progress-soft text-status-progress',
  'Approved by Lecturer': 'bg-status-done-soft text-status-done',
  Verified: 'bg-status-done-soft text-status-done',
  Approved: 'bg-status-done-soft text-status-done',
  Paid: 'bg-status-done-soft text-status-done',
  Rejected: 'bg-status-danger-soft text-status-danger',
  'Rejected by Lecturer': 'bg-status-danger-soft text-status-danger',
};
