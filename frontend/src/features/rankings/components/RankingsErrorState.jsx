import React from "react";

export const RankingsErrorState = ({ error, onRetry }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body text-center py-5">
      <div className="display-1 mb-4 text-danger">⚠️</div>
      <h3 className="fw-bold mb-3">Failed to Load Rankings</h3>
      <p className="text-muted mb-4">{error}</p>
      <button className="btn btn-primary px-4 py-2 rounded-pill" onClick={onRetry}>
        Try Again
      </button>
    </div>
  </div>
);