import React from "react";
import { getMarkerColor, getStatusLabel } from "../services/mapThresholdService";

export const NeighborhoodPopup = ({ neighborhood, thresholds }) => {
  const n = neighborhood;

  return (
    <div style={{ minWidth: "180px" }}>
      <h6 className="fw-bold mb-2">{n.neighborhood_name}</h6>
      <table className="table table-sm table-borderless mb-0" style={{ fontSize: "0.85rem" }}>
        <tbody>
          {n.rank && (
            <tr>
              <td className="text-muted">Rank</td>
              <td className="fw-bold">#{n.rank}</td>
            </tr>
          )}
          <tr>
            <td className="text-muted">Efficiency</td>
            <td className="fw-bold">
              {n.efficiency !== null ? `${n.efficiency.toFixed(1)} kWh/house` : "N/A"}
            </td>
          </tr>
          <tr>
            <td className="text-muted">Households</td>
            <td>{n.households.toLocaleString()}</td>
          </tr>
          {n.total_kwh !== null && (
            <tr>
              <td className="text-muted">Total kWh</td>
              <td>{Number(n.total_kwh).toLocaleString()}</td>
            </tr>
          )}
          <tr>
            <td className="text-muted">Status</td>
            <td style={{ color: getMarkerColor(n.efficiency, thresholds) }}>
              {getStatusLabel(n.efficiency, thresholds)}
            </td>
          </tr>
          <tr>
            <td className="text-muted">Zip Code</td>
            <td>{n.zip_code || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
