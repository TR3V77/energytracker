// frontend/src/components/KpiCard.js
import React from "react";

export default function KpiCard({ title, value, unit, trend }) {
  const getTrendClass = () => {
    if (!trend) return "";
    if (trend.includes('✅')) return "text-success";
    if (trend.includes('⚠️')) return "text-warning";
    if (trend.includes('🔴')) return "text-danger";
    return "text-muted";
  };

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted text-uppercase small">
          {title}
        </h6>
        <div className="d-flex align-items-baseline mb-2">
          <h2 className="card-title mb-0 display-6 fw-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h2>
          <span className="ms-2 text-muted small">{unit}</span>
        </div>
        {trend && (
          <div className={`small fw-medium ${getTrendClass()}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}