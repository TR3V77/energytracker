import React from "react";
import { TrendBadge } from "./TrendsBadge";

export const TrendsTable = ({ trends }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-header bg-transparent border-0 pt-4 px-4">
      <h5 className="fw-bold mb-0">Month-over-Month Changes</h5>
    </div>
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Neighborhood</th>
              <th className="text-end">Previous Period</th>
              <th className="text-end">Current Period</th>
              <th className="text-end">Change</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((trend, index) => (
              <tr key={index}>
                <td className="fw-medium">{trend.neighborhood}</td>
                <td className="text-end">{trend.previousValue.toLocaleString()} kWh</td>
                <td className="text-end">{trend.currentValue.toLocaleString()} kWh</td>
                <td className="text-end">
                  <TrendBadge change={trend.change} trend={trend.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);