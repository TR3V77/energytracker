import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const TrendsChart = ({ trends }) => {
  // Transform data for multi-line chart
  const chartData = [
    { 
      month: "January", 
      ...trends.reduce((acc, t) => ({ ...acc, [t.neighborhood]: t.previousValue }), {}) 
    },
    { 
      month: "February", 
      ...trends.reduce((acc, t) => ({ ...acc, [t.neighborhood]: t.currentValue }), {}) 
    },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe", "#00c49f"];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-transparent border-0 pt-4 px-4">
        <h5 className="fw-bold mb-0">Historical Trend Chart</h5>
        <p className="text-muted small mb-0">6-month trend visualization for each neighborhood</p>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {trends.map((trend, idx) => (
              <Line
                key={trend.neighborhood}
                type="monotone"
                dataKey={trend.neighborhood}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};