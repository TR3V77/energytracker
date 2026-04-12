import React, { useState } from "react";
import { getPriorityConfig, getStatusConfig } from "../constants/recommendationConfig";
import { RecommendationCardActions } from "./RecommendationCardActions";

export const RecommendationCard = ({ 
  recommendation, 
  currentStatus, 
  onUpdateStatus 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const priorityConfig = getPriorityConfig(recommendation.priority);
  const statusConfig = getStatusConfig(currentStatus);
  const isStarted = currentStatus !== "not_started" && currentStatus !== "dismissed";

  return (
    <div className="col-12">
      <div className={`card border-0 shadow-sm ${priorityConfig.bgClass}`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <h5 className="card-title fw-bold mb-0">
                  {recommendation.neighborhood || "General"}
                </h5>
                <span className={`badge ${priorityConfig.badgeClass} rounded-pill`}>
                  {priorityConfig.icon} {priorityConfig.label}
                </span>
                <span className={`badge ${statusConfig.badgeClass} rounded-pill`}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
                {recommendation.score && (
                  <span className="badge bg-light text-dark rounded-pill">
                    Score: {recommendation.score.toFixed(1)} kWh/house
                  </span>
                )}
              </div>

              <p className="card-text text-muted mb-2">
                {recommendation.message || recommendation.reason}
              </p>

              {recommendation.action && (
                <div className="mt-2">
                  <small className="text-muted">
                    <span className="fw-bold">Recommended Action:</span> {recommendation.action}
                  </small>
                </div>
              )}
            </div>
          </div>

          {isExpanded && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="fw-bold mb-2">Implementation Steps:</h6>
              <ul className="small mb-0">
                <li>Review energy audit findings</li>
                <li>Schedule consultation with energy experts</li>
                <li>Apply for available rebates</li>
                <li>Track monthly consumption improvements</li>
              </ul>
              <div className="mt-2 pt-2 border-top">
                <small className="text-muted">
                  Estimated savings: {recommendation.estimated_impact_pct || "Varies"}% reduction
                </small>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <RecommendationCardActions 
              status={currentStatus} 
              onUpdateStatus={onUpdateStatus} 
            />
            <button 
              className="btn btn-sm btn-link text-decoration-none" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less ↑" : "Learn More ↓"}
            </button>
            <small className="text-muted">
              Est. impact:{" "}
              {recommendation.estimated_impact_pct != null
                ? `${recommendation.estimated_impact_pct}%`
                : "—"}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};