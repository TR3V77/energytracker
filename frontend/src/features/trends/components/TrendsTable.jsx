import React from "react";
import { TrendBadge } from "./TrendsBadge";

export const TrendsTable = ({ trends }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-header bg-transparent border-0 pt-4 px-4">
      <h5 className="fw-bold mb-0">Monthly Breakdown</h5>
    </div>
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Period</th>
              <th className="text-end">Total Consumption</th>
              <th className="text-end">Change</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((trend, index) => (
              <tr key={index}>
                <td className="fw-medium">{trend.period}</td>
                <td className="text-end">{Number(trend.kwh).toLocaleString()} kWh</td>
                <td className="text-end">
                  {trend.pct_change !== null ? (
                    <TrendBadge change={trend.pct_change} trend={trend.pct_change < 0 ? "down" : "up"} />
                  ) : (
                    <span className="text-muted">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
