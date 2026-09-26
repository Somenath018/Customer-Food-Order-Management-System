import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'ready_for_pickup':
        return {
          label: 'Ready for Pickup',
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      case 'accepted':
        return {
          label: 'Assigned / Accepted',
          classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
        };
      case 'picked_up':
        return {
          label: 'Picked Up',
          classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        };
      case 'on_the_way':
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          classes: 'bg-rider-500/20 text-rider-300 border-rider-500/40'
        };
      case 'delivered':
        return {
          label: 'Delivered',
          classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        };
      default:
        return {
          label: status || 'Unknown',
          classes: 'bg-gray-500/15 text-gray-300 border-gray-500/30'
        };
    }
  };

  const { label, classes } = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}
    >
      {label}
    </span>
  );
};
