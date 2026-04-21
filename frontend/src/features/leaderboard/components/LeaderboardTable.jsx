import React from "react";
import { LeaderboardTableRow } from "./LeaderboardTableRow";

export const LeaderboardTable = ({ rankings }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "100px" }}>Rank</th>
              <th>Neighborhood</th>
              <th style={{ width: "200px" }}>Efficiency Score</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((item) => (
              <LeaderboardTableRow
                key={item.rank}
                rank={item.rank}
                neighborhoodName={item.neighborhood}
                efficiency={item.efficiencyScore}
                medal={item.medal}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);