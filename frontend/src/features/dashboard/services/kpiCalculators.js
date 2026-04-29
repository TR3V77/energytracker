export const calculateTotalKwh = (data) => 
  data.reduce((sum, record) => sum + Number(record.total_kwh ?? 0), 0);

export const calculateAverageKwh = (data) => 
  data.length ? calculateTotalKwh(data) / data.length : 0;

export const calculatePeakKwh = (data) => 
  data.length ? Math.max(...data.map(record => Number(record.total_kwh ?? 0))) : 0;

export const calculateEfficiencyScore = (totalKwh, households) => 
  households > 0 ? totalKwh / households : null;

export const getEfficiencyRating = (score) => {
  if (score === null || !Number.isFinite(score)) {
    return { label: "No household data", color: "text-muted", icon: "—", gradient: "linear-gradient(135deg, #6c757d, #495057)" };
  }
  if (score < 380) {
    return { label: "Efficient", color: "text-success", icon: "✅", gradient: "linear-gradient(135deg, #28a745, #1e7b34)" };
  }
  if (score < 430) {
    return { label: "Average", color: "text-warning", icon: "⚠️", gradient: "linear-gradient(135deg, #ffc107, #d39e00)" };
  }
  return { label: "Needs Improvement", color: "text-danger", icon: "🔴", gradient: "linear-gradient(135deg, #dc3545, #a71d2a)" };
};

export const calculateHouseholdsRepresented = (filteredData, householdsByNeighborhoodId) => {
  const uniqueNeighborhoodIds = [...new Set(filteredData.map(d => d.neighborhood_id))];
  return uniqueNeighborhoodIds.reduce((sum, id) => sum + (householdsByNeighborhoodId[id] ?? 0), 0);
};