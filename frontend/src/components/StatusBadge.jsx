import React from 'react';

const StatusBadge = ({ status }) => {
  // This object maps each status to a color combination
  const statusColors = {
    'Approved': 'bg-success text-white',
    'Paid': 'bg-success text-white',
    'Pending': 'bg-warning text-dark',
    'Rejected': 'bg-error text-white'
  };

  // Get the colors for this status, or use default if not found
  const colors = statusColors[status] || 'bg-light-grey text-neutral';

  // Return a styled span
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
//e.g
//<StatusBadge status="Approved" />  // Shows green badge
//<StatusBadge status="Pending" />   // Shows yellow badge
//<StatusBadge status="Rejected" />  // Shows red badge