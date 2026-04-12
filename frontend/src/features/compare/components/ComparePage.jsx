import React from "react";
import { Link } from "react-router-dom";

export const ComparePage = () => (
  <div className="compare-page">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold mb-0">Compare Neighborhoods</h2>
      <Link to="/dashboard" className="btn btn-outline-secondary btn-sm rounded-pill">
        ← Back to Dashboard
      </Link>
    </div>
    
    <div className="card border-0 shadow-sm">
      <div className="card-body text-center py-5">
        <div className="display-1 mb-4">🏘️</div>
        <h3 className="fw-bold mb-3">Coming Soon!</h3>
        <p className="text-muted mb-4">
          Side-by-side neighborhood energy comparison is under development.
          This feature will allow you to compare efficiency scores, consumption patterns,
          and recommendation progress across multiple neighborhoods.
        </p>
        <div className="alert alert-info d-inline-block">
          Expected release: Q2 2025
        </div>
      </div>
    </div>
  </div>
);

export default ComparePage;