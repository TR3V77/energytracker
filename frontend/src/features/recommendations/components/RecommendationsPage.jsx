import React from "react";
import { useRecommendations } from "../hooks/useRecommendations";
import { useRecommendationTracker } from "../hooks/useRecommendationTracker";
import { useRecommendationFilters } from "../hooks/useRecommendationFilters";
import { calculateStats } from "../services/recommendationStats";
import { RecommendationsStatsPanel } from "./RecommendationsStatsPanel";
import { RecommendationsFilterToolbar } from "./RecommendationsFilterToolbar";
import { RecommendationCard } from "./RecommendationCard";
import { RebateSection } from "./RebateSection";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ErrorDisplay } from "../../../shared/components/ErrorDisplay";

export const RecommendationsPage = () => {
  const { recommendations, loading, error, refetch } = useRecommendations();
  const { tracker, getStatus, updateStatus } = useRecommendationTracker();
  const {
    filteredData,
    priorityFilter,
    setPriorityFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    handleSort,
    getSortIcon,
    clearFilters,
  } = useRecommendationFilters(recommendations);

  if (loading) return <LoadingSpinner message="Loading recommendations..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} title="Failed to Load Recommendations" />;

  const recommendationsWithKeys = filteredData.map((rec, idx) => ({
    ...rec,
    rowKey: rec.id || rec.rowKey || `rec_${idx}`,
  }));

  const stats = calculateStats(recommendationsWithKeys, tracker);

  return (
    <div className="recommendations-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Energy Efficiency Recommendations</h2>
        {recommendations.length === 0 && (
          <span className="badge bg-secondary px-3 py-2 rounded-pill">
            No recommendations available
          </span>
        )}
      </div>

      {recommendations.length > 0 ? (
        <>
          <RecommendationsStatsPanel stats={stats} />
          
          <RecommendationsFilterToolbar
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            getSortIcon={getSortIcon}
            onClearFilters={clearFilters}
          />

          <div className="row g-4">
            {recommendationsWithKeys.map((recommendation) => (
              <RecommendationCard
                key={recommendation.rowKey}
                recommendation={recommendation}
                currentStatus={getStatus(recommendation.rowKey)}
                onUpdateStatus={(status) => updateStatus(recommendation.rowKey, status)}
              />
            ))}
          </div>

          <RebateSection />
        </>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="display-1 mb-4">💡</div>
            <h3 className="fw-bold mb-3">No Recommendations Available</h3>
            <p className="text-muted mb-4">
              No energy efficiency recommendations are available at this time.
            </p>
            <button className="btn btn-primary px-4 py-2 rounded-pill" onClick={refetch}>
              Refresh Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;