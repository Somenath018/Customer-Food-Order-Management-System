// Utility formatting helpers

export const formatCurrency = (amount) => {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
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
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const formatDistance = (km) => {
  if (!km) return '1.8 km';
  return `${Number(km).toFixed(1)} km`;
};

export const formatPhone = (phone) => {
  if (!phone) return '+91 98765 43210';
  // If already formatted with +91 or starts with 91, return clean string
  if (phone.startsWith('+91')) return phone;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
};
