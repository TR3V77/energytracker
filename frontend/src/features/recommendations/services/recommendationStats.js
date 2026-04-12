import { RECOMMENDATION_STATUS } from "../constants/recommendationConfig";

export const isActiveRecommendation = (rowKey, tracker) => {
  if (!rowKey) return true;
  const status = tracker[rowKey]?.status;
  return status !== RECOMMENDATION_STATUS.IMPLEMENTED && status !== RECOMMENDATION_STATUS.DISMISSED;
};

export const calculateStats = (recommendations, tracker = {}) => {
  const recommendationsWithKeys = recommendations.map((rec, idx) => ({
    ...rec,
    rowKey: rec.rowKey || rec.id || `rec_${idx}`
  }));
  
  const active = recommendationsWithKeys.filter(rec => isActiveRecommendation(rec.rowKey, tracker));
  
  const trackerValues = Object.values(tracker);
  const implemented = trackerValues.filter(t => t?.status === RECOMMENDATION_STATUS.IMPLEMENTED).length;
  const inProgress = trackerValues.filter(t => t?.status === RECOMMENDATION_STATUS.IN_PROGRESS).length;
  
  return {
    total: recommendations.length,
    remaining: active.length,
    high: active.filter(r => r.priority?.toLowerCase() === "high").length,
    medium: active.filter(r => r.priority?.toLowerCase() === "medium").length,
    low: active.filter(r => r.priority?.toLowerCase() === "low").length,
    implemented: implemented,
    inProgress: inProgress,
  };
};