// frontend/src/features/rankings/services/efficiencyCalculatorService.js

// THIS FILE IS DEPRECATED AND DISABLED
// Backend now provides efficiency scores directly in /api/analytics/rankings response
// If you need this functionality, use the backend-provided data instead.
// Remove this file after confirming no breaking changes in production.

/*
export const calculateEfficiencyScore = (totalKwh, households) => {
  if (!households || households === 0) return 0;
  return totalKwh / households;
};

export const sortByEfficiencyAscending = (rankings) => {
  return [...rankings].sort((a, b) => a.efficiency - b.efficiency);
};

export const addRankNumbers = (rankings) => {
  return rankings.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
};
*/