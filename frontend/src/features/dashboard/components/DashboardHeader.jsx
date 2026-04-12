import React from "react";

export const DashboardHeader = () => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h2 className="fw-bold mb-0">Energy Dashboard</h2>
    <span className="badge bg-light text-dark px-4 py-2 rounded-pill">
      <span className="me-2">🔄</span> 
      Last Updated: {new Date().toLocaleDateString()}
    </span>
  </div>
);