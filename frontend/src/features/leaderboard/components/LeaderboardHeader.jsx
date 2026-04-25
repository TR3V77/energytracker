import React from "react";

const formatGeneratedAt = (generatedAt) => {
  if (!generatedAt) {
    return "Generated time unavailable";
  }

  const parsedDate = new Date(generatedAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Generated time unavailable";
  }

  return `Generated ${parsedDate.toLocaleString()}`;
};

const formatWindow = (windowValue) => {
  if (!windowValue) {
    return "Window: unavailable";
  }

  if (typeof windowValue === "object") {
    const { from, to } = windowValue;
    if (from && to) {
      return `Window: ${from} to ${to}`;
    }
  }

  return `Window: ${String(windowValue)}`;
};

export const LeaderboardHeader = ({ generatedAt, window }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h2 className="fw-bold mb-1">
        🏆 Neighborhood Efficiency Leaderboard
      </h2>
      <p className="text-muted mb-0">
        Lower efficiency score = More efficient (kWh per household)
      </p>
      <small className="text-muted d-block mt-1">{formatWindow(window)}</small>
      <small className="text-muted d-block">{formatGeneratedAt(generatedAt)}</small>
    </div>
    <span className="badge bg-primary px-3 py-2 rounded-pill">
      Real-time Rankings
    </span>
  </div>
);