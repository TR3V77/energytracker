// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import EnergyChart from "../components/EnergyChart";
import { getEnergyData } from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getEnergyData();
      setData(result);
    }
    fetchData();
  }, []);

  // Example KPI calculations
  const totalKwh = data.reduce((sum, item) => sum + item.kWh, 0);
  const averageKwh = data.length ? (totalKwh / data.length).toFixed(2) : 0;

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Consumption" value={totalKwh} unit="kWh" />
        <KpiCard title="Average Daily Usage" value={averageKwh} unit="kWh/day" />
        <KpiCard title="Peak Day" value={data.length ? Math.max(...data.map(d => d.kWh)) : 0} unit="kWh" />
        <KpiCard title="Neighborhood Efficiency" value={320} unit="kWh/house" trend="✅ More efficient" />
      </div>

      <EnergyChart data={data} />
    </div>
  );
}