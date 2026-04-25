/**
 * Calculate progress bar segments
 * Transform stats into progress bar segments
 */
export const calculateProgressSegments = (stats) => {
  const total = stats?.total || 0;
  const implemented = stats?.implemented || 0;
  const inProgress = stats?.inProgress || 0;

  const implementedPercent = total > 0 ? (implemented / total) * 100 : 0;
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;

  return {
    total,
    implemented,
    inProgress,
    implementedPercent,
    inProgressPercent,
  };
};

/**
 * Build progress bar segments array
 * Convert percentages to segment objects
 */
export const buildProgressBarSegments = (segments) => {
  const barSegments = [];
  
  if (segments.implementedPercent > 0) {
    barSegments.push({
      percent: segments.implementedPercent,
      colorClass: "bg-success",
      title: `Implemented: ${segments.implemented} recommendations`,
    });
  }
  
  if (segments.inProgressPercent > 0) {
    barSegments.push({
      percent: segments.inProgressPercent,
      colorClass: "bg-info",
      title: `In Progress: ${segments.inProgress} recommendations`,
    });
  }
  
  return barSegments;
};

/**
 * Build legend items
 * Convert stats into legend items
 */
export const buildLegendItems = (segments) => {
  const items = [
    { label: "Implemented", count: segments.implemented, colorClass: "bg-success" },
    { label: "In Progress", count: segments.inProgress, colorClass: "bg-info" },
  ];
  
  const remainingCount = segments.total - segments.implemented - segments.inProgress;
  if (remainingCount > 0) {
    items.push({ 
      label: "Remaining", 
      count: remainingCount, 
      colorClass: "bg-light border" 
    });
  }
  
  return items;
};

/**
 * Get stat cards configuration
 */
export const getStatCardsConfig = (stats) => {
  if (!stats) return [];

  return [
    { value: stats.remaining || 0, label: "Remaining", colorClass: "text-primary", icon: "📋" },
    { value: stats.high || 0, label: "High Priority", colorClass: "text-danger", icon: "🔴" },
    { value: stats.medium || 0, label: "Medium Priority", colorClass: "text-warning", icon: "🟡" },
    { value: stats.low || 0, label: "Low Priority", colorClass: "text-success", icon: "🟢" },
    { value: stats.implemented || 0, label: "Implemented", colorClass: "text-success", icon: "✅" },
    { value: stats.inProgress || 0, label: "In Progress", colorClass: "text-info", icon: "🔄" },
  ];
};