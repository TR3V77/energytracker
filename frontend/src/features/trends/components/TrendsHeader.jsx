import React from "react";

export const TrendsHeader = () => (
  <>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold mb-0">Trend Analysis</h2>
      <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
        Month-over-Month Comparison
      </span>
    </div>
    <p className="text-muted mb-4">
      Track energy consumption patterns across neighborhoods and identify areas needing attention.
    </p>
  </>
);