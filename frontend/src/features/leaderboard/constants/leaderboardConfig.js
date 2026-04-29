export const EFFICIENCY_THRESHOLDS = {
  EFFICIENT: 380,
  AVERAGE: 430,
};

export const EFFICIENCY_RATINGS = {
  EFFICIENT: {
    label: "Efficient",
    badgeClass: "bg-success",
    icon: "✅",
  },
  AVERAGE: {
    label: "Average",
    badgeClass: "bg-warning text-dark",  // Keep text-dark for yellow background
    icon: "⚠️",
  },
  NEEDS_IMPROVEMENT: {
    label: "Needs Improvement",
    badgeClass: "bg-danger",  // No text class - defaults to white
    icon: "🔴",
  },
};

export const MEDAL_CONFIG = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};