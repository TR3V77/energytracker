import React from "react";

export const LeaderboardLoadingState = () => (
  <div className="card border-0 shadow-sm">
    <div className="card-body text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mb-0">Loading leaderboard data...</p>
    </div>
  </div>
);