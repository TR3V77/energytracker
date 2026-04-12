import React from "react";

export const DashboardSummaryStats = ({ filteredData, peakKwh, efficiencyScore, efficiencyRating }) => {
  const uniqueNeighborhoodCount = new Set(filteredData.map(d => d.neighborhood_id)).size;

  return (
    <div className="row mt-4">
      <div className="col-md-6">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="text-muted mb-3">Date Range</h6>
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Records:</span>
              <span>{filteredData.length} entries</span>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span className="fw-bold">Neighborhoods:</span>
              <span>{uniqueNeighborhoodCount}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="text-muted mb-3">Summary</h6>
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Avg Efficiency:</span>
              <span className={efficiencyRating.color}>
                {efficiencyScore != null ? `${efficiencyScore.toFixed(2)} kWh/house` : '—'}
              </span>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span className="fw-bold">Peak Day:</span>
              <span>{peakKwh.toLocaleString()} kWh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};