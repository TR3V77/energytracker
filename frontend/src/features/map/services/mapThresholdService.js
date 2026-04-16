export const getThresholds = (data) => {
  const scores = data.filter((d) => d.efficiency !== null).map((d) => d.efficiency);
  if (scores.length === 0) return { low: 0, high: 0 };
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;
  return { low: min + range * 0.33, high: min + range * 0.66 };
};

export const getMarkerColor = (efficiency, thresholds) => {
  if (efficiency === null || efficiency === undefined) return "#6c757d";
  if (efficiency <= thresholds.low) return "#28a745";
  if (efficiency <= thresholds.high) return "#ffc107";
  return "#dc3545";
};

export const getStatusLabel = (efficiency, thresholds) => {
  if (efficiency === null || efficiency === undefined) return "No data";
  if (efficiency <= thresholds.low) return "Efficient";
  if (efficiency <= thresholds.high) return "Average";
  return "Needs Improvement";
};
