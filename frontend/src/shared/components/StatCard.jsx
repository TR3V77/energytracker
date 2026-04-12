import React from "react";

export const StatCard = ({ value, label, colorClass, icon }) => (
  <div className="col-md-2 col-sm-4 col-6">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center">
        <div className="display-6 mb-2">{icon}</div>
        <h3 className={`fw-bold mb-1 ${colorClass}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  </div>
);