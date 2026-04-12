import React from "react";

export const TrendsSummary = ({ summary }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-header bg-transparent border-0 pt-4 px-4">
      <h5 className="fw-bold mb-0">Summary Statistics</h5>
    </div>
    <div className="card-body">
      <div className="mb-4">
        <h6 className="text-muted mb-2">Overall Trend</h6>
        <div className="progress mb-2" style={{ height: "30px" }}>
          <div 
            className="progress-bar bg-success" 
            style={{ width: `${summary.decreasingPercentage}%` }}
          >
            Decreasing: {summary.decreasingPercentage}%
          </div>
          <div 
            className="progress-bar bg-danger" 
            style={{ width: `${summary.increasingPercentage}%` }}
          >
            Increasing: {summary.increasingPercentage}%
          </div>
        </div>
      </div>

      <h6 className="text-muted mb-3">Key Insights</h6>
      <div className="list-group list-group-flush">
        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span>Average Monthly Change</span>
          <span className={`fw-bold ${summary.averageChange >= 0 ? "text-danger" : "text-success"}`}>
            {summary.averageChange >= 0 ? "+" : ""}{summary.averageChange.toFixed(1)}%
          </span>
        </div>
        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span>Most Improved</span>
          <span className="badge bg-success rounded-pill">
            {summary.mostImproved} ↓{Math.abs(summary.mostImprovedChange)}%
          </span>
        </div>
        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span>Needs Attention</span>
          <span className="badge bg-warning text-dark rounded-pill">
            {summary.needsAttention} ↑{Math.abs(summary.needsAttentionChange)}%
          </span>
        </div>
      </div>
    </div>
  </div>
);