import React from "react";
import { StatCard } from "../../../shared/components/StatCard";

export const RecommendationsStatsPanel = ({ stats }) => {
  const progressPercent = stats.total ? (stats.implemented / stats.total) * 100 : 0;
  const inProgressPercent = stats.total ? (stats.inProgress / stats.total) * 100 : 0;

  const statCards = [
    { value: stats.remaining, label: "Remaining", colorClass: "text-primary", icon: "📋" },
    { value: stats.high, label: "High Priority", colorClass: "text-danger", icon: "🔴" },
    { value: stats.medium, label: "Medium Priority", colorClass: "text-warning", icon: "🟡" },
    { value: stats.low, label: "Low Priority", colorClass: "text-success", icon: "🟢" },
    { value: stats.implemented, label: "Implemented", colorClass: "text-success", icon: "✅" },
    { value: stats.inProgress, label: "In Progress", colorClass: "text-info", icon: "🔄" },
  ];

  return (
    <>
      <div className="row g-4 mb-4">
        {statCards.map((stat) => (
          <StatCard 
            key={stat.label}
            value={stat.value}
            label={stat.label}
            colorClass={stat.colorClass}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted fw-bold">Implementation Progress</small>
            <small className="text-muted">
              {stats.implemented}/{stats.total || 0} completed ({Math.round(progressPercent)}%)
            </small>
          </div>
          <div className="progress" style={{ height: "8px" }}>
            <div className="progress-bar bg-success" style={{ width: `${progressPercent}%` }} />
            <div className="progress-bar bg-info" style={{ width: `${inProgressPercent}%` }} />
          </div>
          <div className="d-flex justify-content-between mt-2">
            <small className="text-muted"><span className="badge bg-success me-1" style={{ width: "10px", height: "10px", padding: 0 }}></span> Implemented</small>
            <small className="text-muted"><span className="badge bg-info me-1" style={{ width: "10px", height: "10px", padding: 0 }}></span> In Progress</small>
          </div>
        </div>
      </div>
    </>
  );
};