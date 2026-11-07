// Utility formatting functions for CloudSage

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (val) => {
  if (val === undefined || val === null) return '0%';
  return `${Math.round(val)}%`;
};

export const formatStorage = (gb) => {
  if (!gb) return '0 GB';
  if (gb >= 1024) {
    return `${(gb / 1024).toFixed(1)} TB`;
  }
  return `${gb} GB`;
};

