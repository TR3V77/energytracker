import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const TrendsChart = ({ trends }) => {
  const withChange = trends.filter((t) => t.pct_change !== null);

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h5 className="fw-bold mb-0">Monthly Energy Consumption</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} kWh`, "Consumption"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="kwh"
                  name="Total kWh"
                  stroke="#0066cc"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h5 className="fw-bold mb-0">Month-over-Month Changes</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={withChange}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "Change"]} />
                <Bar
                  dataKey="pct_change"
                  name="% Change"
                  fill="#0066cc"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
