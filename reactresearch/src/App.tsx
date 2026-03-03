import { useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import EfficiencyRankings from "./components/EfficiencyRankings";
import DataUpload from "./components/DataUpload";
import TrendAnalysis from "./components/TrendAnalysis";
import Recommendations from "./components/Recommendations";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "rankings", label: "Efficiency Rankings", icon: "🏆" },
    { id: "trends", label: "Trend Analysis", icon: "📈" },
    { id: "recommendations", label: "Recommendations", icon: "💡" },
    { id: "upload", label: "Upload Data", icon: "📁" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "rankings":
        return <EfficiencyRankings />;
      case "trends":
        return <TrendAnalysis />;
      case "recommendations":
        return <Recommendations />;
      case "upload":
        return <DataUpload />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <span className="brand-icon">⚡</span>
            Energy Tracker
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.id}>
                  <button
                    className={`nav-link btn ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <main className="container mt-4">
        <div className="content-wrapper">{renderContent()}</div>
      </main>
      <footer className="footer mt-auto py-3 bg-light">
        <div className="container text-center">
          <span className="text-muted">
            Central Texas Neighborhood Energy Tracker © 2024
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
