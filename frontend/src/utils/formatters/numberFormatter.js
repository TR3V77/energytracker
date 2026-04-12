export const formatNumber = (value) => {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
};

export const formatKwh = (value) => {
  if (value === null || value === undefined) return "—";
  return `${value.toLocaleString()} kWh`;
};