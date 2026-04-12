import React from "react";
import { Link } from "react-router-dom";

export const RankingsEmptyState = () => (
  <div className="card border-0 shadow-sm">
    <div className="card-body text-center py-5">
      <div className="display-1 mb-4">🏆</div>
      <h3 className="fw-bold mb-3">No Rankings Data Available</h3>
      <p className="text-muted mb-4">
        Upload energy consumption data to see neighborhood efficiency rankings.
      </p>
      <Link to="/upload" className="btn btn-primary px-4 py-2 rounded-pill">
        📁 Upload Data
      </Link>
    </div>
  </div>
);