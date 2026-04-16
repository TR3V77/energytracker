import React from "react";

const LegendDot = ({ color, label }) => (
  <span className="d-flex align-items-center gap-1">
    <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: color, display: "inline-block" }}></span>
    <small className="text-muted">{label}</small>
  </span>
);

export const MapLegend = () => (
  <div className="d-flex gap-3 align-items-center">
    <LegendDot color="#28a745" label="Efficient" />
    <LegendDot color="#ffc107" label="Average" />
    <LegendDot color="#dc3545" label="Needs Improvement" />
  </div>
);
