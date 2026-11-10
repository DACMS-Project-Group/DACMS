const money = (value) =>
  `R ${Number(value ?? 0).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatMoney = (value) => money(value);

export const formatMoneyCompact = (value) => {
  const amount = Number(value ?? 0);
  const absolute = Math.abs(amount);

  if (absolute >= 1_000_000) return `R ${(amount / 1_000_000).toFixed(1)}m`;
  if (absolute >= 1_000) return `R ${(amount / 1_000).toFixed(1)}k`;

  return `R ${Math.round(amount)}`;
};

export const formatNumber = (value, digits = 2) =>
  Number(value ?? 0).toLocaleString('en-ZA', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const formatHours = (value, digits = 1) =>
  `${formatNumber(value, digits)} hrs`;

export const formatPercent = (value, digits = 1) =>
  `${formatNumber(value, digits)}%`;

export const formatDate = (value, fallback = '—') => {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (value, fallback = '—') => {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
