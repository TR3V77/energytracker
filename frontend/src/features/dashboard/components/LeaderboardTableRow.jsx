import React from "react";

// Helper function to determine medal based on rank
const getMedal = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
};

// Component to render a single row in the leaderboard table
const LeaderboardTableRow = ({ rank, neighborhood, efficiencyScore }) => {
  const medal = getMedal(rank);

  return (
    <tr>
      <td>
        {rank} {medal && <span>{medal}</span>}
      </td>
      <td>{neighborhood}</td>
      <td>{efficiencyScore.toFixed(2)}</td>
    </tr>
  );
};

export default LeaderboardTableRow;