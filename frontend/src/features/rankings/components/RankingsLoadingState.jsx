import React from "react";

export const RankingsLoadingState = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-muted">Loading rankings...</p>
  </div>
);