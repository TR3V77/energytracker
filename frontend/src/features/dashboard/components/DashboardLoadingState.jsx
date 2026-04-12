import React from "react";

export const DashboardLoadingState = () => (
  <>
    <h2 className="mb-4">Energy Dashboard</h2>
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Loading dashboard...</p>
    </div>
  </>
);