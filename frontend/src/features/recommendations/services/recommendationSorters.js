import { PRIORITY_CONFIG } from "../constants/recommendationConfig";

const getPriorityOrder = (priority) => PRIORITY_CONFIG[priority?.toLowerCase()]?.order || 0;

export const sortRecommendations = (items, sortBy, sortOrder = "desc") => {
  const sorted = [...items];
  const order = sortOrder === "asc" ? 1 : -1;
  
  sorted.sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case "priority":
        aVal = getPriorityOrder(a.priority);
        bVal = getPriorityOrder(b.priority);
        break;
      case "score":
        aVal = a.score || 0;
        bVal = b.score || 0;
        break;
      default:
        aVal = a.neighborhood || "";
        bVal = b.neighborhood || "";
    }
    return aVal > bVal ? order : aVal < bVal ? -order : 0;
  });
  
  return sorted;
};