import React from "react";

export const RankingsHeader = ({ usingMockData = false }) => (
  <>
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h2 className="fw-bold mb-0">Neighborhood Efficiency Rankings</h2>
      {usingMockData && (
        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
          📊 Demo Data
        </span>
      )}
    </div>
    <p className="text-muted mb-4">
      Lower efficiency score = More efficient (kWh per household)
    </p>
  </>
);