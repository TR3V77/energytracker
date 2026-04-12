import React from "react";
import { Link } from "react-router-dom";
import { useRecommendations } from "../../recommendations/hooks/useRecommendations";
import { getPriorityConfig } from "../../recommendations/constants/recommendationConfig";
import { truncateText } from "../../../utils/formatters/textFormatter";

export const DashboardRecommendationsPanel = ({ limit = 3 }) => {
  const { recommendations, loading, error } = useRecommendations();
  
  const displayedRecs = recommendations.slice(0, limit);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary spinner-border-sm" />
          <p className="mt-2 text-muted small">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error || displayedRecs.length === 0) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body text-center py-4">
          <div className="display-6 mb-2">💡</div>
          <h6 className="fw-bold mb-1">No Recommendations</h6>
          <p className="text-muted small mb-0">
            No recommendations available at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0 pt-3 px-3 d-flex justify-content-between align-items-center">
        <h6 className="fw-bold mb-0">
          <span className="me-1">💡</span> Recommendations
        </h6>
        <span className="badge bg-primary rounded-pill small">{displayedRecs.length}</span>
      </div>
      <div className="card-body p-3">
        <div className="recommendations-list" style={{ maxHeight: "380px", overflowY: "auto" }}>
          {displayedRecs.map((rec) => {
            const priorityConfig = getPriorityConfig(rec.priority);
            const previewText = truncateText(rec.message || rec.reason || "—", 100);
            
            return (
              <div
                key={rec.rowKey}
                className={`recommendation-item p-2 mb-2 rounded-2 border-start border-3 ${priorityConfig.bgClass}`}
                style={{ borderLeftColor: priorityConfig.badgeClass.includes("danger") ? "#dc3545" : priorityConfig.badgeClass.includes("warning") ? "#ffc107" : "#28a745" }}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="fw-bold small">{rec.neighborhood || "General"}</span>
                  <span className={`badge ${priorityConfig.badgeClass} rounded-pill small px-2 py-0`}>
                    {priorityConfig.icon} {priorityConfig.label.split(" ")[0]}
                  </span>
                </div>
                <p className="mb-1 small text-muted">{previewText}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pb-3 pt-0 px-3">
        <Link to="/recommendations" className="btn btn-link text-decoration-none p-0 small">
          View all recommendations →
        </Link>
      </div>
    </div>
  );
};