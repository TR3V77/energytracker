export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(decimals)}%`;
};