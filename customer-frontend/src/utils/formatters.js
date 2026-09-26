// Utility formatters for customer module

export const formatCurrency = (amount) => {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '--';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatFullDate = (isoString) => {
  if (!isoString) return '--';
  const date = new Date(isoString);
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDistance = (km) => {
  if (!km) return '1.5 km';
  return `${Number(km).toFixed(1)} km`;
};

export const formatPhone = (phone) => {
  return phone || '+1 (555) 432-8765';
};
