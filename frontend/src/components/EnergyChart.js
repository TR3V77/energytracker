// frontend/src/components/EnergyChart.js
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function EnergyChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="consumption_kwh" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}