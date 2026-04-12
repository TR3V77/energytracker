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