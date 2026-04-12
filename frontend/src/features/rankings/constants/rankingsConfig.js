export const EFFICIENCY_THRESHOLDS = {
  EFFICIENT: 380,
  AVERAGE: 430,
};

export const STATUS_CONFIG = {
  EFFICIENT: {
    badgeClass: "bg-success",
    icon: "✅",
    label: "Efficient",
    textClass: "text-success",
  },
  AVERAGE: {
    badgeClass: "bg-warning",
    icon: "⚠️",
    label: "Average",
    textClass: "text-warning",
  },
  NEEDS_IMPROVEMENT: {
    badgeClass: "bg-danger",
    icon: "🔴",
    label: "Needs Improvement",
    textClass: "text-danger",
  },
};

export const DEFAULT_RANKINGS = [
  { rank: 1, neighborhood_name: "Downtown", efficiency: 320, households: 2450, total_kwh: 784000 },
  { rank: 2, neighborhood_name: "Riverside", efficiency: 355, households: 1890, total_kwh: 670950 },
  { rank: 3, neighborhood_name: "North Hills", efficiency: 378, households: 3200, total_kwh: 1209600 },
  { rank: 4, neighborhood_name: "Westside", efficiency: 412, households: 2800, total_kwh: 1153600 },
  { rank: 5, neighborhood_name: "East End", efficiency: 445, households: 2100, total_kwh: 934500 },
  { rank: 6, neighborhood_name: "South Park", efficiency: 489, households: 1950, total_kwh: 953550 },
];