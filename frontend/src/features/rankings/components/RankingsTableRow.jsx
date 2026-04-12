import React from "react";

export const RankingsTableRow = ({ rank, neighborhoodName, efficiency, households, totalKwh, status }) => (
  <tr>
    <td>
      <strong>#{rank}</strong>
      {rank === 1 && <span className="ms-2">🏆</span>}
    </td>
    <td>{neighborhoodName}</td>
    <td>
      <span className={`badge ${status.badgeClass}`}>
        {efficiency.toLocaleString()} kWh/household
      </span>
    </td>
    <td>{households.toLocaleString()}</td>
    <td>{totalKwh.toLocaleString()} kWh</td>
    <td className={status.textClass}>
      {status.icon} {status.label}
    </td>
  </tr>
);