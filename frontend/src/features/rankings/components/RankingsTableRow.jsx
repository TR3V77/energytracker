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
        {typeof efficiency === 'number' ? efficiency.toLocaleString() : efficiency} kWh/household
      </span>
    </td>
    <td>{households == null ? "—" : households.toLocaleString()}</td>
    <td>
      {totalKwh == null ? "—" : `${totalKwh.toLocaleString()} kWh`}
    </td>
    <td className={status.textClass}>
      {status.icon} {status.label}
    </td>
  </tr>
);