import React from "react";
import { EFFICIENCY_THRESHOLDS, EFFICIENCY_RATINGS, MEDAL_CONFIG } from "../constants/leaderboardConfig";

const getEfficiencyRating = (score) => {
  if (score < EFFICIENCY_THRESHOLDS.EFFICIENT) return EFFICIENCY_RATINGS.EFFICIENT;
  if (score < EFFICIENCY_THRESHOLDS.AVERAGE) return EFFICIENCY_RATINGS.AVERAGE;
  return EFFICIENCY_RATINGS.NEEDS_IMPROVEMENT;
};

const getMedal = (rank) => MEDAL_CONFIG[rank] || null;

export const LeaderboardTableRow = ({ rank, neighborhoodName, efficiency }) => {
  const rating = getEfficiencyRating(efficiency);
  const medal = getMedal(rank);
  const formattedScore = efficiency.toLocaleString(undefined, { maximumFractionDigits: 1 });
  
  return (
    <tr className="align-middle">
      <td style={{ width: "100px" }}>
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold fs-5">#{rank}</span>
          {medal && <span className="fs-5">{medal}</span>}
        </div>
      </td>
      <td>
        <span className="fw-medium">{neighborhoodName}</span>
      </td>
      <td style={{ width: "200px" }}>
        <span className={`badge ${rating.badgeClass} fs-6 px-3 py-2 rounded-pill`}>
          {rating.icon} {formattedScore} kWh/household
        </span>
      </td>
    </tr>
  );
};