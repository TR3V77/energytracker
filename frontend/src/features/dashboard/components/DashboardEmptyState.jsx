import React from "react";

export const DashboardEmptyState = () => (
  <>
    <h2 className="mb-4">Energy Dashboard</h2>
    <div className="text-center py-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body py-5">
          <div className="display-1 mb-4 text-warning">📊</div>
          <h3 className="fw-bold mb-3">No Data Available</h3>
          <p className="text-muted mb-4">
            No energy consumption data has been loaded yet.
          </p>
          <p className="text-muted small">
            Please ensure the backend has seed data or contact your administrator.
          </p>
        </div>
      </div>
    </div>
  </>
);