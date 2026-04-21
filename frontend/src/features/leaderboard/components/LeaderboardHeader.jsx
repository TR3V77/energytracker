import React from "react";

export const LeaderboardHeader = () => (
  <>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold mb-1">
          🏆 Neighborhood Efficiency Leaderboard
        </h2>
        <p className="text-muted mb-0">
          Lower efficiency score = More efficient (kWh per household)
        </p>
      </div>
      <span className="badge bg-primary px-3 py-2 rounded-pill">
        Real-time Rankings
      </span>
    </div>
  </>
);