export const formatEfficiencyScore = (score) => {
  if (score === null || score === undefined) {
    return { formattedValue: "—", colorClass: "text-muted", statusLabel: "No Data" };
  }
  
  const formattedValue = `${score.toFixed(0)} kWh/house`;
  
  if (score < 340) {
    return { formattedValue, colorClass: "text-success", statusLabel: "Efficient" };
  }
  if (score < 400) {
    return { formattedValue, colorClass: "text-warning", statusLabel: "Average" };
  }
  return { formattedValue, colorClass: "text-danger", statusLabel: "Needs Improvement" };
};