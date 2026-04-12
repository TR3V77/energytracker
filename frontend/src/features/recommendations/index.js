// Main Component
export { RecommendationsPage } from "./components/RecommendationsPage";

// Hooks
export { useRecommendations } from "./hooks/useRecommendations";
export { useRecommendationTracker } from "./hooks/useRecommendationTracker";
export { useRecommendationFilters } from "./hooks/useRecommendationFilters";

// Services (Pure Functions)
export * from "./services/recommendationFilters";
export * from "./services/recommendationSorters";
export * from "./services/recommendationStats";

// Constants
export * from "./constants/recommendationConfig";