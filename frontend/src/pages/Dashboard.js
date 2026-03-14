// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import EnergyChart from "../components/EnergyChart";
import { getEnergyData } from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getEnergyData();
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // KPI Calculations (exactly the same as before)
  const totalKwh = data.reduce((sum, item) => sum + (item.consumption_kwh || 0), 0);
  const averageKwh = data.length ? (totalKwh / data.length).toFixed(2) : 0;
  const peakDay = data.length ? Math.max(...data.map(d => d.consumption_kwh || 0)) : 0;
  
  // Calculate efficiency if we have household data
  const totalHouseholds = data.reduce((sum, item) => sum + (item.households || 0), 0);
  const avgEfficiency = totalHouseholds ? (totalKwh / totalHouseholds).toFixed(2) : 320;
  
  // Generate trend indicator based on efficiency
  const getEfficiencyTrend = () => {
    if (avgEfficiency < 380) return "✅ Efficient";
    if (avgEfficiency < 430) return "⚠️ Average";
    return "🔴 Needs improvement";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="mb-4">Energy Dashboard</h2>

      {/* KPI Cards - Now with consistent styling */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <KpiCard 
            title="Total Consumption" 
            value={totalKwh} 
            unit="kWh" 
            trend={data.length ? `${data.length} records` : null}
          />
        </div>
        <div className="col-md-3">
          <KpiCard 
            title="Average Daily Usage" 
            value={averageKwh} 
            unit="kWh/day" 
          />
        </div>
        <div className="col-md-3">
          <KpiCard 
            title="Peak Day" 
            value={peakDay} 
            unit="kWh" 
          />
        </div>
        <div className="col-md-3">
          <KpiCard 
            title="Neighborhood Efficiency" 
            value={avgEfficiency} 
            unit="kWh/house" 
            trend={getEfficiencyTrend()}
          />
        </div>
      </div>

      {/* Chart Section - Matching card style from other pages */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <h5 className="mb-0">Energy Consumption Over Time</h5>
        </div>
        <div className="card-body">
          {data.length > 0 ? (
            <EnergyChart data={data} />
          ) : (
            <div className="text-center py-5 bg-light rounded-3">
              <p className="text-muted mb-0">No data available. Please upload a file first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}