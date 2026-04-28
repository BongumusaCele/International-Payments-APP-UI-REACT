import React from 'react';

interface StatusBadgeProps {
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeClass = {
    Pending: 'badge-pending',
    'Under Review': 'badge-warning',
    Approved: 'badge-success',
    Rejected: 'badge-danger',
    Completed: 'badge-success',
  };

  return (
    <span className={`badge ${badgeClass[status]}`}>
      {status}
    </span>
  );
};
