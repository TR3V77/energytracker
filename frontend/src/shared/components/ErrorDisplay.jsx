import React from "react";

export const ErrorDisplay = ({ error, onRetry, title = "Something went wrong" }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body text-center py-5">
      <div className="display-1 mb-4 text-danger">⚠️</div>
      <h3 className="fw-bold mb-3">{title}</h3>
      <p className="text-muted mb-4">{error}</p>
      {onRetry && (
        <button className="btn btn-primary px-4 py-2 rounded-pill" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  </div>
);