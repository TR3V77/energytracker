import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  // Sample data - in real app, this would come from API
  const summaryMetrics = [
    {
      label: "Total Energy Consumption",
      value: "2.4M kWh",
      change: -5.2,
      unit: "kWh",
    },
    { label: "Average per Household", value: "845", change: 2.1, unit: "kWh" },
    { label: "Solar Adoption Rate", value: "23%", change: 8.5, unit: "%" },
    { label: "Active Neighborhoods", value: "12", change: 0, unit: "" },
  ];

  return (
    <div className="dashboard">
      <h2 className="mb-4">Energy Dashboard</h2>

      {/* Summary Cards */}
      <div className="row mb-4">
        {summaryMetrics.map((metric, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <div className="card metric-card">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">
                  {metric.label}
                </h6>
                <h3 className="card-title mb-2">
                  {metric.value} {metric.unit}
                </h3>
                <span
                  className={`badge ${metric.change >= 0 ? "bg-warning" : "bg-success"}`}
                >
                  {metric.change > 0 ? "↑" : metric.change < 0 ? "↓" : "→"}
                  {Math.abs(metric.change)}% from last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Energy Consumption Over Time</h5>
            </div>
            <div className="card-body chart-placeholder">
              <div className="text-center text-muted py-5">
                <h4>📊 Line Chart Placeholder</h4>
                <p>Energy usage trends across neighborhoods</p>
                <small>
                  Filter by: Neighborhood | Date Range | Energy Type
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Neighborhood Comparison</h5>
            </div>
            <div className="card-body chart-placeholder">
              <div className="text-center text-muted py-5">
                <h4>📊 Bar Chart Placeholder</h4>
                <p>Energy usage by neighborhood</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card mt-3">
        <div className="card-body">
          <h5>Filters</h5>
          <div className="row">
            <div className="col-md-3">
              <select className="form-select">
                <option>All Neighborhoods</option>
                <option>Downtown</option>
                <option>Riverside</option>
                <option>North Hills</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="Start Date"
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="End Date"
              />
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option>All Energy Types</option>
                <option>Electric</option>
                <option>Natural Gas</option>
                <option>Solar</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
