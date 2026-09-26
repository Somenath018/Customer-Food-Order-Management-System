import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'placed':
        return {
          label: 'Order Placed',
          classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        };
      case 'preparing':
        return {
          label: 'Kitchen Preparing',
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      case 'ready_for_pickup':
        return {
          label: 'Ready for Pickup',
          classes: 'bg-orange-500/15 text-orange-300 border-orange-500/30'
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          classes: 'bg-brand-500/20 text-brand-300 border-brand-500/40'
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes}`}
    >
      {label}
    </span>
  );
};
