import { RECOMMENDATION_STATUS } from "../constants/recommendationConfig";

/**
 * Calculate statistics from recommendations and their current statuses
 * 
 * Pure function - no side effects, no dependencies on React or hooks
 * 
 * @param {Array} recommendations - List of recommendation objects with rowKey and priority
 * @param {Object} statusMap - Map of rowKey -> status string
 * @returns {Object} Statistics object with counts
 */
export const calculateStats = (recommendations, statusMap) => {
  // Guard clauses
  if (!recommendations || recommendations.length === 0) {
    return getEmptyStats();
  }

  // Initialize counters
  const counts = {
    implemented: 0,
    inProgress: 0,
    planned: 0,
    notStarted: 0,
    dismissed: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  // Single pass through recommendations
  for (const rec of recommendations) {
    // Count by status (using statusMap lookup)
    const status = statusMap[rec.rowKey] || RECOMMENDATION_STATUS.NOT_STARTED;
    
    switch (status) {
      case RECOMMENDATION_STATUS.IMPLEMENTED:
        counts.implemented++;
        break;
      case RECOMMENDATION_STATUS.IN_PROGRESS:
        counts.inProgress++;
        break;
      case RECOMMENDATION_STATUS.PLANNED:
        counts.planned++;
        break;
      case RECOMMENDATION_STATUS.DISMISSED:
        counts.dismissed++;
        break;
      default:
        counts.notStarted++;
        break;
    }

    // Count by priority
    const priority = rec.priority?.toLowerCase();
    if (priority === "high") counts.high++;
    else if (priority === "medium") counts.medium++;
    else if (priority === "low") counts.low++;
  }

  const total = recommendations.length;
  const remaining = total - counts.implemented;

  return {
    total,
    remaining,
    implemented: counts.implemented,
    inProgress: counts.inProgress,
    planned: counts.planned,
    notStarted: counts.notStarted,
    dismissed: counts.dismissed,
    high: counts.high,
    medium: counts.medium,
    low: counts.low,
  };
};

/**
 * Return empty stats structure (useful for loading/error states)
 */
export const getEmptyStats = () => ({
  total: 0,
  remaining: 0,
  implemented: 0,
  inProgress: 0,
  planned: 0,
  notStarted: 0,
  dismissed: 0,
  high: 0,
  medium: 0,
  low: 0,
});