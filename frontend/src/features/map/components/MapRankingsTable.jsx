import React from "react";
import { getMarkerColor, getStatusLabel } from "../services/mapThresholdService";

export const MapRankingsTable = ({ rankings, thresholds }) => (
  <div className="card border-0 shadow-sm mt-4">
    <div className="card-header bg-transparent border-0 pt-3">
      <h5 className="mb-0">Neighborhood Rankings</h5>
    </div>
    <div className="card-body">
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>Neighborhood</th>
            <th>Efficiency</th>
            <th>Households</th>
            <th>Total kWh</th>
            <th>Zip Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((n) => (
            <tr key={n.neighborhood_id}>
              <td><strong>#{n.rank}</strong>{n.rank === 1 && " \uD83C\uDFC6"}</td>
              <td>{n.neighborhood_name}</td>
              <td>{n.efficiency.toFixed(1)} kWh/house</td>
              <td>{n.households.toLocaleString()}</td>
              <td>{n.total_kwh !== null ? Number(n.total_kwh).toLocaleString() : "N/A"} kWh</td>
              <td>{n.zip_code || "N/A"}</td>
              <td>
                <span style={{ color: getMarkerColor(n.efficiency, thresholds) }}>
                  {getStatusLabel(n.efficiency, thresholds)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
