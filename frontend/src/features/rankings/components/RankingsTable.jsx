import React from "react";
import { RankingsTableRow } from "./RankingsTableRow";

export const RankingsTable = ({ rankings }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Neighborhood</th>
              <th>Efficiency Score</th>
              <th>Total Households</th>
              <th>Total Consumption (kWh)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((item) => (
              <RankingsTableRow
                key={item.rank}
                rank={item.rank}
                neighborhoodName={item.neighborhood_name}
                efficiency={item.efficiency}
                households={item.households}
                totalKwh={item.total_kwh}
                status={item.status}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);