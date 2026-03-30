import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getRecommendations } from "../services/api";
import { RECOMMENDATION_STATUS, getStatusConfig } from "../constants/recommendationStatus";
import { useImplementationTracker } from "../hooks/useImplementationTracker";

// ========== SEPARATE UTILITY FUNCTIONS ==========

// Priority configuration (Single Responsibility: defines priority rules)
const PRIORITY_CONFIG = {
  high: { order: 3, badge: "bg-danger", icon: "🔴", label: "High Priority", border: "border-danger", bg: "bg-danger bg-opacity-10" },
  medium: { order: 2, badge: "bg-warning text-dark", icon: "🟡", label: "Medium Priority", border: "border-warning", bg: "bg-warning bg-opacity-10" },
  low: { order: 1, badge: "bg-success", icon: "🟢", label: "Low Priority", border: "border-success", bg: "bg-success bg-opacity-10" },
};

// Utility: Get priority value (Single Responsibility: priority extraction)
const getPriorityValue = (priority) => PRIORITY_CONFIG[priority?.toLowerCase()]?.order || 0;

// Utility: Get styles for priority/status (Single Responsibility: style mapping)
const getItemStyles = (priority, status) => {
  if (status) {
    const statusConfig = getStatusConfig(status);
    return {
      badge: statusConfig.badge,
      icon: statusConfig.icon,
      label: statusConfig.label,
      border: `border-${statusConfig.badge.replace("bg-", "")}`,
      bg: `${statusConfig.badge.replace("bg-", "bg-")}-opacity-10`,
    };
  }
  return PRIORITY_CONFIG[priority?.toLowerCase()] || PRIORITY_CONFIG.low;
};

// Utility: Filter recommendations (Single Responsibility: filtering logic)
const filterRecommendations = (items, priorityFilter, searchTerm) => {
  let filtered = [...items];
  
  if (priorityFilter !== "all") {
    filtered = filtered.filter(item => 
      item.priority?.toLowerCase() === priorityFilter
    );
  }
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(item =>
      [item.neighborhood, item.message, item.action].some(field =>
        field?.toLowerCase().includes(term)
      )
    );
  }
  
  return filtered;
};

// Utility: Sort recommendations (Single Responsibility: sorting logic)
const sortRecommendations = (items, sortBy, sortOrder) => {
  const sorted = [...items];
  const order = sortOrder === "asc" ? 1 : -1;
  
  sorted.sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case "priority":
        aVal = getPriorityValue(a.priority);
        bVal = getPriorityValue(b.priority);
        break;
      case "score":
        aVal = a.score || 0;
        bVal = b.score || 0;
        break;
      default:
        aVal = a.neighborhood || "";
        bVal = b.neighborhood || "";
    }
    return aVal > bVal ? order : aVal < bVal ? -order : 0;
  });
  
  return sorted;
};

// Utility: Calculate stats (Single Responsibility: statistics calculation)
const calculateStats = (items) => ({
  total: items.length,
  high: items.filter(i => i.priority?.toLowerCase() === "high").length,
  medium: items.filter(i => i.priority?.toLowerCase() === "medium").length,
  low: items.filter(i => i.priority?.toLowerCase() === "low").length,
});

// ========== REUSABLE COMPONENTS ==========

// Stat Card Component (Single Responsibility: display single stat)
const StatCard = ({ value, label, colorClass }) => (
  <div className="col-md-3">
    <div className="card border-0 shadow-sm text-center">
      <div className="card-body">
        <div className={`display-6 fw-bold ${colorClass}`}>{value}</div>
        <div className="text-muted small">{label}</div>
      </div>
    </div>
  </div>
);

// Filter Button Component (Single Responsibility: priority filter button)
const FilterButton = ({ priority, label, icon, isActive, onClick }) => (
  <button
    type="button"
    className={`btn ${isActive ? `btn-${priority === "all" ? "primary" : priority}` : "btn-outline-secondary"}`}
    onClick={onClick}
  >
    {icon && <span className="me-1">{icon}</span>}{label}
  </button>
);

// Recommendation Card Component (Single Responsibility: display single recommendation)
const RecommendationCard = ({ recommendation, index, status, onImplement, onDismiss, onToggleExpand, isExpanded }) => {
  const styles = getItemStyles(recommendation.priority, status);
  
  return (
    <div className={`col-12`}>
      <div className={`card border-0 shadow-sm ${styles.bg}`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <h5 className="card-title fw-bold mb-0">{recommendation.neighborhood || 'General'}</h5>
                <span className={`badge ${styles.badge} rounded-pill`}>
                  {styles.icon} {styles.label}
                </span>
                {recommendation.score && (
                  <span className="badge bg-light text-dark rounded-pill">
                    Score: {recommendation.score.toFixed(1)} kWh/house
                  </span>
                )}
              </div>
              <p className="card-text text-muted mb-2">{recommendation.message}</p>
              {recommendation.action && (
                <div className="mt-2">
                  <small className="text-muted">
                    <span className="fw-bold">Recommended Action:</span> {recommendation.action}
                  </small>
                </div>
              )}
            </div>
          </div>
          
          {isExpanded && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="fw-bold mb-2">Implementation Steps:</h6>
              <ul className="small mb-0">
                <li>Review energy audit findings</li>
                <li>Schedule consultation with energy experts</li>
                <li>Apply for available rebates</li>
                <li>Track monthly consumption improvements</li>
              </ul>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={onImplement} disabled={status === "implemented"}>
                {status === "implemented" ? "✅ Implemented" : "Implement"}
              </button>
              {!status && (
                <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={onDismiss}>
                  Dismiss
                </button>
              )}
              <button className="btn btn-sm btn-link text-decoration-none" onClick={onToggleExpand}>
                {isExpanded ? "Show Less ↑" : "Learn More ↓"}
              </button>
            </div>
            <small className="text-muted">Estimated Savings: {recommendation.savings_potential || "Varies"}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

// Rebate Card Component (Single Responsibility: display rebate opportunity)
const RebateCard = ({ icon, title, description, amount }) => (
  <div className="col-md-4">
    <div className="p-3 border rounded-3">
      <div className="h2 mb-2">{icon}</div>
      <h6 className="fw-bold">{title}</h6>
      <p className="small text-muted">{description}</p>
      <span className="badge bg-success">{amount}</span>
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedId, setExpandedId] = useState(null);
  const [implementedStatus, setImplementedStatus] = useState({});

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await getRecommendations({});
      setRecommendations(response.data?.recommendations || response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Processed data using utility functions (Single Responsibility: data transformation)
  const processedData = useMemo(() => {
    const filtered = filterRecommendations(recommendations, priorityFilter, searchTerm);
    return sortRecommendations(filtered, sortBy, sortOrder);
  }, [recommendations, priorityFilter, searchTerm, sortBy, sortOrder]);

  const stats = useMemo(() => calculateStats(recommendations), [recommendations]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (loading) return (
    <div className="recommendations-page">
      <h2 className="mb-4">AI-Powered Recommendations</h2>
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading recommendations...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="recommendations-page">
      <h2 className="mb-4">AI-Powered Recommendations</h2>
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="display-1 mb-4 text-danger">⚠️</div>
          <h3 className="fw-bold mb-3">Oops! Something went wrong</h3>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary px-4 py-2 rounded-pill" onClick={fetchRecommendations}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="recommendations-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">AI-Powered Recommendations</h2>
        <div className="dropdown">
          <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
            📄 Export
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Export as PDF</a></li>
            <li><a className="dropdown-item" href="#">Export as CSV</a></li>
          </ul>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        <StatCard value={stats.total} label="Total Recommendations" colorClass="text-primary" />
        <StatCard value={stats.high} label="High Priority" colorClass="text-danger" />
        <StatCard value={stats.medium} label="Medium Priority" colorClass="text-warning" />
        <StatCard value={stats.low} label="Low Priority" colorClass="text-success" />
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small text-muted">Filter by Priority</label>
              <div className="btn-group w-100" role="group">
                <FilterButton priority="all" label="All" isActive={priorityFilter === "all"} onClick={() => setPriorityFilter("all")} />
                <FilterButton priority="high" label="High" icon="🔴" isActive={priorityFilter === "high"} onClick={() => setPriorityFilter("high")} />
                <FilterButton priority="medium" label="Medium" icon="🟡" isActive={priorityFilter === "medium"} onClick={() => setPriorityFilter("medium")} />
                <FilterButton priority="low" label="Low" icon="🟢" isActive={priorityFilter === "low"} onClick={() => setPriorityFilter("low")} />
              </div>
            </div>
            <div className="col-md-5">
              <label className="form-label small text-muted">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">🔍</span>
                <input type="text" className="form-control" placeholder="Search by neighborhood, message, or action..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {searchTerm && (
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchTerm("")}>✕</button>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Sort by</label>
              <div className="d-flex gap-2">
                {["priority", "neighborhood", "score"].map(col => (
                  <button key={col} className="btn btn-sm btn-outline-secondary" onClick={() => handleSort(col)}>
                    {col.charAt(0).toUpperCase() + col.slice(1)} {getSortIcon(col)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {processedData.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="display-1 mb-4">💡</div>
            <h3 className="fw-bold mb-3">No Recommendations Found</h3>
            <p className="text-muted mb-4">
              {searchTerm || priorityFilter !== "all" ? "Try adjusting your search or filters." : "Upload more data to get AI-powered insights."}
            </p>
            {!searchTerm && priorityFilter === "all" && (
              <Link to="/upload" className="btn btn-primary px-4 py-2 rounded-pill">Upload Data</Link>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {processedData.map((rec, index) => (
            <RecommendationCard
              key={rec.id || index}
              recommendation={rec}
              index={index}
              status={implementedStatus[rec.id || index]}
              onImplement={() => setImplementedStatus(prev => ({ ...prev, [rec.id || index]: "implemented" }))}
              onDismiss={() => setImplementedStatus(prev => ({ ...prev, [rec.id || index]: "dismissed" }))}
              onToggleExpand={() => setExpandedId(expandedId === index ? null : index)}
              isExpanded={expandedId === index}
            />
          ))}
        </div>
      )}

      {/* Rebate Opportunities */}
      {recommendations.length > 0 && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h5 className="fw-bold mb-0">💰 Available Rebate Opportunities</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <RebateCard icon="🏠" title="Weatherization Assistance" description="Free home energy audits and upgrades for qualifying households" amount="Up to $5,000" />
              <RebateCard icon="☀️" title="Solar Installation Credit" description="Federal tax credit for solar panel installation" amount="26% Tax Credit" />
              <RebateCard icon="🌡️" title="Smart Thermostat Rebate" description="Rebate for installing energy-efficient smart thermostats" amount="Up to $100" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;