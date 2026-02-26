// frontend/src/components/KpiCard.js
import React from "react";

export default function KpiCard({ title, value, unit, trend }) {
  return (
    <div className="p-4 bg-white rounded shadow border">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold my-2">
        {value} {unit}
      </div>
      {trend && (
        <div className="text-sm text-gray-400">
          {trend}
        </div>
      )}
    </div>
  );
}