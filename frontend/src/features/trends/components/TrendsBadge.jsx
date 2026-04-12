import React from "react";

export const TrendBadge = ({ change, trend }) => {
  const isUp = trend === "up";
  const colorClass = isUp ? "text-danger" : "text-success";
  const icon = isUp ? "↑" : "↓";

  return (
    <span className={`fw-bold ${colorClass}`}>
      {icon} {Math.abs(change).toFixed(1)}%
    </span>
  );
};