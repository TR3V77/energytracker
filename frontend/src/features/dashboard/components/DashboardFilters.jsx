import React from "react";

export const DashboardFilters = ({ selectedNeighborhoodId, onNeighborhoodChange, neighborhoods }) => (
  <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
    <h5 className="mb-0">Energy Consumption Over Time</h5>
    <select
      className="form-select form-select-sm"
      style={{ maxWidth: "260px" }}
      value={selectedNeighborhoodId}
      onChange={(e) => onNeighborhoodChange(e.target.value)}
      aria-label="Filter by neighborhood"
    >
      <option value="all">All neighborhoods</option>
      {neighborhoods.map((n) => (
        <option key={n.neighborhood_id} value={String(n.neighborhood_id)}>
          {n.neighborhood_name}
        </option>
      ))}
    </select>
  </div>
);