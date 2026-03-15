// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import EnergyChart from "../components/EnergyChart";
import { getEnergyData } from "../services/api";
import { Link } from "react-router-dom";

// Reusable KPI Card Component with colors
const ColoredKpiCard = ({ title, value, unit, gradient, icon, subtitle }) => (
  <div className="col-md-3">
    <div className="card border-0 shadow-sm h-100" style={{ background: gradient }}>
      <div className="card-body text-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-white-50 text-uppercase small fw-bold mb-0">{title}</h6>
          <span className="badge bg-white rounded-pill px-3" style={{ 
            color: gradient.includes('0066cc') ? '#0066cc' : 
                   gradient.includes('28a745') ? '#28a745' : 
                   gradient.includes('fd7e14') ? '#fd7e14' : '#dc3545' 
          }}>
            {icon}
          </span>
        </div>
        <h2 className="display-6 fw-bold mb-2 text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h2>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-white-50">{unit}</span>
          {subtitle && <span className="text-white-50 small">{subtitle}</span>}
        </div>
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-5">
    <div className="card border-0 shadow-sm">
      <div className="card-body py-5">
        <div className="display-1 mb-4 text-danger">⚠️</div>
        <h3 className="fw-bold mb-3">Oops! Something went wrong</h3>
        <p className="text-muted mb-4">{error}</p>
        <button className="btn btn-primary px-4 py-2 rounded-pill" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  </div>
);

// No Data State Component
const NoDataState = () => (
  <div className="text-center py-5">
    <div className="card border-0 shadow-sm">
      <div className="card-body py-5">
        <div className="display-1 mb-4 text-warning">📊</div>
        <h3 className="fw-bold mb-3">No Data Available</h3>
        <p className="text-muted mb-4">Upload a CSV or JSON file to start visualizing your energy data.</p>
        <Link to="/upload" className="btn btn-success px-4 py-2 rounded-pill">
          <span className="me-2">📁</span> Upload Your First File
        </Link>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEnergyData();
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // KPI Calculations
  const totalKwh = data.reduce((sum, item) => sum + (item.consumption_kwh || 0), 0);
  const averageKwh = data.length ? (totalKwh / data.length).toFixed(2) : 0;
  const peakDay = data.length ? Math.max(...data.map(d => d.consumption_kwh || 0)) : 0;
  
  // Calculate efficiency if we have household data
  const totalHouseholds = data.reduce((sum, item) => sum + (item.households || 0), 0);
  const avgEfficiency = totalHouseholds ? (totalKwh / totalHouseholds).toFixed(2) : 320;
  
  // Get efficiency color and label
  const getEfficiencyStyles = () => {
    if (avgEfficiency < 380) {
      return { 
        gradient: 'linear-gradient(135deg, #28a745, #1e7b34)',
        icon: '✅',
        label: 'Efficient'
      };
    } else if (avgEfficiency < 430) {
      return { 
        gradient: 'linear-gradient(135deg, #ffc107, #d39e00)',
        icon: '⚠️',
        label: 'Average'
      };
    } else {
      return { 
        gradient: 'linear-gradient(135deg, #dc3545, #a71d2a)',
        icon: '🔴',
        label: 'Needs Improvement'
      };
    }
  };

  // Generate trend indicator based on efficiency
  const getEfficiencyTrend = () => {
    if (avgEfficiency < 380) return "✅ Efficient";
    if (avgEfficiency < 430) return "⚠️ Average";
    return "🔴 Needs improvement";
  };

  // Loading State
  if (loading) {
    return (
      <div className="dashboard">
        <h2 className="mb-4">Energy Dashboard</h2>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="dashboard">
        <h2 className="mb-4">Energy Dashboard</h2>
        <ErrorState error={error} onRetry={fetchData} />
      </div>
    );
  }

  // No Data State
  if (data.length === 0) {
    return (
      <div className="dashboard">
        <h2 className="mb-4">Energy Dashboard</h2>
        <NoDataState />
      </div>
    );
  }

  const efficiencyStyles = getEfficiencyStyles();

  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Energy Dashboard</h2>
        <span className="badge bg-light text-dark px-4 py-2 rounded-pill">
          <span className="me-2">🔄</span> 
          Last Updated: {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Colorful KPI Cards */}
      <div className="row g-4 mb-4">
        <ColoredKpiCard 
          title="Total Consumption"
          value={totalKwh}
          unit="kWh"
          gradient="linear-gradient(135deg, #0066cc, #004999)"
          icon="⚡"
          subtitle={`${data.length} records`}
        />
        
        <ColoredKpiCard 
          title="Average Daily Usage"
          value={averageKwh}
          unit="kWh/day"
          gradient="linear-gradient(135deg, #28a745, #1e7b34)"
          icon="📅"
        />
        
        <ColoredKpiCard 
          title="Peak Day"
          value={peakDay}
          unit="kWh"
          gradient="linear-gradient(135deg, #fd7e14, #dc3545)"
          icon="🔥"
        />
        
        <ColoredKpiCard 
          title="Neighborhood Efficiency"
          value={avgEfficiency}
          unit="kWh/house"
          gradient={efficiencyStyles.gradient}
          icon={efficiencyStyles.icon}
          subtitle={efficiencyStyles.label}
        />
      </div>

      {/* Chart Section */}
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

      {/* Quick Stats Row (optional) */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-3">Date Range</h6>
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Records:</span>
                <span>{data.length} entries</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="fw-bold">Neighborhoods:</span>
                <span>{new Set(data.map(d => d.neighborhood)).size}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-3">Summary</h6>
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Avg Efficiency:</span>
                <span className={avgEfficiency < 380 ? 'text-success' : avgEfficiency < 430 ? 'text-warning' : 'text-danger'}>
                  {avgEfficiency} kWh/house
                </span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="fw-bold">Peak Day:</span>
                <span>{peakDay.toLocaleString()} kWh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}