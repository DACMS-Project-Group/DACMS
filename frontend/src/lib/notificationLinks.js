/**
 * Notifications store their related-page hint inside the message text
 * (for example "View /claim-detail/12."). Keep the path list in one place
 * and translate paths that no longer exist to their current equivalent.
 */
const ROUTE_NAMES = [
  'application-review',
  'application-detail',
  'appointment-approvals',
  'appointment-review',
  'verify-hours',
  'session-detail',
  'review-claims',
  'review-claim',
  'claim-detail',
  'review-applications',
];

const ROUTE_PATTERN = new RegExp(
  `/(${ROUTE_NAMES.join('|')})(?:/(\\d+))?(?![\\w/-])`
);

// ApplicationReview was removed; reviews now happen inside the queue.
const LEGACY_TARGETS = {
  'application-review': () => '/review-applications',
};

export const getNotificationTarget = (message = '') => {
  const match = String(message).match(ROUTE_PATTERN);

  if (!match) {
    return null;
  }

  const [, route, id] = match;
  const legacyTarget = LEGACY_TARGETS[route];

  if (legacyTarget) {
    return legacyTarget(id);
  }

  return id ? `/${route}/${id}` : `/${route}`;
};

export const splitNotificationMessage = (message = '') => {
  const text = String(message);
  const match = text.match(ROUTE_PATTERN);

  if (!match) {
    return { text, target: null };
  }

  const before = text
    .slice(0, match.index)
    .replace(/[.\s]+$/, '')
    .replace(/(?:^|\s)(?:open|view|see|at)$/i, '');
  const after = text
    .slice(match.index + match[0].length)
    .replace(/^[.\s]+/, '');

  return {
    text: [before, after].filter(Boolean).join(' '),
    target: getNotificationTarget(text),
  };
};

/**
 * Older/seeded notifications have no path in their message. Fall back to the
 * role-appropriate list page for the notification type so every notification
 * still leads somewhere useful.
 */
export const getNotificationFallbackTarget = (type = '', role = 'student') => {
  const value = String(type).toLowerCase();

  if (value.includes('claim')) {
    if (role === 'lecturer') return '/review-claims';
    if (role === 'admin') return '/admin/claims';
    return '/claims';
  }

  if (value.includes('session') || value.includes('work')) {
    if (role === 'lecturer') return '/verify-hours';
    if (role === 'admin') return '/admin-dashboard';
    return '/work-tracking';
  }

  if (
    value.includes('application') ||
    value.includes('position') ||
    value.includes('appointment')
  ) {
    if (role === 'lecturer') return '/review-applications';
    if (role === 'admin') return '/appointment-approvals';
    return '/applications';
  }

  if (value.includes('administration')) {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'lecturer') return '/lecturer-dashboard';
    return '/student-dashboard';
  }

  return null;
};
