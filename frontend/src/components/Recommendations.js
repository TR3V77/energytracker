import React, { useState, useEffect, useMemo } from "react";
import { getRecommendations } from "../services/api";

const Recommendations = () => {
   const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and sort states
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority"); // priority, neighborhood, score
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedCard, setExpandedCard] = useState(null);
  const [implementationStatus, setImplementationStatus] = useState({});

  // Fetch recommendations from backend
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecommendations({});
      const recs = response.data?.recommendations || [];
      setRecommendations(recs);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.response?.data?.error || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort recommendations
  const filteredRecommendations = useMemo(() => {
    let filtered = [...recommendations];
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(rec => rec.priority === priorityFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(rec =>
        rec.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.action?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aVal = priorityOrder[a.priority] || 0;
          bVal = priorityOrder[b.priority] || 0;
          break;
        case "neighborhood":
          aVal = a.neighborhood || "";
          bVal = b.neighborhood || "";
          break;
        case "score":
          aVal = a.score || 0;
          bVal = b.score || 0;
          break;
        default:
          aVal = a.priority;
          bVal = b.priority;
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return filtered;
  }, [recommendations, priorityFilter, searchTerm, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleImplement = (id) => {
    setImplementationStatus({
      ...implementationStatus,
      [id]: "implemented"
    });
    alert("Recommendation implementation started!");
  };

  const handleDismiss = (id) => {
    setImplementationStatus({
      ...implementationStatus,
      [id]: "dismissed"
    });
  };

  const getPriorityStyles = (priority, status = null) => {
    if (status === "implemented") {
      return { badge: "bg-secondary", icon: "✅", text: "Implemented", border: "border-secondary", bg: "bg-secondary bg-opacity-10" };
    }
    if (status === "dismissed") {
      return { badge: "bg-light text-dark", icon: "❌", text: "Dismissed", border: "border-secondary", bg: "bg-light" };
    }
    switch (priority?.toLowerCase()) {
      case "high":
        return { badge: "bg-danger", icon: "🔴", text: "High Priority", border: "border-danger", bg: "bg-danger bg-opacity-10" };
      case "medium":
        return { badge: "bg-warning text-dark", icon: "🟡", text: "Medium Priority", border: "border-warning", bg: "bg-warning bg-opacity-10" };
      default:
        return { badge: "bg-success", icon: "🟢", text: "Low Priority", border: "border-success", bg: "bg-success bg-opacity-10" };
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  // Stats calculations
  const stats = {
    total: recommendations.length,
    high: recommendations.filter(r => r.priority === "high").length,
    medium: recommendations.filter(r => r.priority === "medium").length,
    low: recommendations.filter(r => r.priority === "low").length,
  };

  if (loading) {
    return (
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
  }

  if (error) {
    return (
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
  }

  return (
    <div className="recommendations-page">
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

      {/* Stats Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <div className="display-6 fw-bold text-primary">{stats.total}</div>
              <div className="text-muted small">Total Recommendations</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <div className="display-6 fw-bold text-danger">{stats.high}</div>
              <div className="text-muted small">High Priority</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <div className="display-6 fw-bold text-warning">{stats.medium}</div>
              <div className="text-muted small">Medium Priority</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <div className="display-6 fw-bold text-success">{stats.low}</div>
              <div className="text-muted small">Low Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small text-muted">Filter by Priority</label>
              <div className="btn-group w-100">
                <button 
                  className={`btn ${priorityFilter === "all" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setPriorityFilter("all")}
                >
                  All
                </button>
                <button 
                  className={`btn ${priorityFilter === "high" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => setPriorityFilter("high")}
                >
                  🔴 High
                </button>
                <button 
                  className={`btn ${priorityFilter === "medium" ? "btn-warning" : "btn-outline-warning"}`}
                  onClick={() => setPriorityFilter("medium")}
                >
                  🟡 Medium
                </button>
                <button 
                  className={`btn ${priorityFilter === "low" ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => setPriorityFilter("low")}
                >
                  🟢 Low
                </button>
              </div>
            </div>
            <div className="col-md-5">
              <label className="form-label small text-muted">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">🔍</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by neighborhood, message, or action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearchTerm("")}>
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Sort by</label>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleSort("priority")}>
                  Priority {getSortIcon("priority")}
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleSort("neighborhood")}>
                  Neighborhood {getSortIcon("neighborhood")}
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleSort("score")}>
                  Score {getSortIcon("score")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {filteredRecommendations.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="display-1 mb-4">💡</div>
            <h3 className="fw-bold mb-3">No Recommendations Found</h3>
            <p className="text-muted mb-4">
              {searchTerm ? "Try adjusting your search or filters." : "Upload more data to get AI-powered insights."}
            </p>
            {!searchTerm && (
              <Link to="/upload" className="btn btn-primary px-4 py-2 rounded-pill">
                Upload Data
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRecommendations.map((rec, index) => {
            const status = implementationStatus[rec.id || index];
            const styles = getPriorityStyles(rec.priority, status);
            
            return (
              <div className="col-12" key={index}>
                <div className={`card border-0 shadow-sm ${styles.bg}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h5 className="card-title fw-bold mb-0">{rec.neighborhood || 'General'}</h5>
                          <span className={`badge ${styles.badge} rounded-pill`}>
                            {styles.icon} {styles.text}
                          </span>
                          {rec.score && (
                            <span className="badge bg-light text-dark rounded-pill">
                              Score: {rec.score.toFixed(1)} kWh/house
                            </span>
                          )}
                        </div>
                        <p className="card-text text-muted mb-2">{rec.message}</p>
                        {rec.action && (
                          <div className="mt-2">
                            <small className="text-muted">
                              <span className="fw-bold">Recommended Action:</span> {rec.action}
                            </small>
                          </div>
                        )}
                      </div>
                      {expandedCard === index && (
                        <div className="ms-3 p-3 bg-light rounded">
                          <h6 className="fw-bold mb-2">Implementation Steps:</h6>
                          <ul className="small mb-0">
                            <li>Review energy audit findings</li>
                            <li>Schedule consultation with energy experts</li>
                            <li>Apply for available rebates</li>
                            <li>Track monthly consumption improvements</li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary rounded-pill"
                          onClick={() => handleImplement(rec.id || index)}
                          disabled={status === "implemented"}
                        >
                          {status === "implemented" ? "✅ Implemented" : "Implement"}
                        </button>
                        {status !== "implemented" && (
                          <button 
                            className="btn btn-sm btn-outline-secondary rounded-pill"
                            onClick={() => handleDismiss(rec.id || index)}
                          >
                            Dismiss
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-link text-decoration-none"
                          onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                        >
                          {expandedCard === index ? "Show Less ↑" : "Learn More ↓"}
                        </button>
                      </div>
                      <small className="text-muted">
                        Estimated Savings: {rec.savings_potential || "Varies"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rebate Opportunities Section */}
      {recommendations.length > 0 && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h5 className="fw-bold mb-0">💰 Available Rebate Opportunities</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 border rounded-3">
                  <div className="h2 mb-2">🏠</div>
                  <h6 className="fw-bold">Weatherization Assistance</h6>
                  <p className="small text-muted">Free home energy audits and upgrades for qualifying households</p>
                  <span className="badge bg-success">Up to $5,000</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded-3">
                  <div className="h2 mb-2">☀️</div>
                  <h6 className="fw-bold">Solar Installation Credit</h6>
                  <p className="small text-muted">Federal tax credit for solar panel installation</p>
                  <span className="badge bg-success">26% Tax Credit</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded-3">
                  <div className="h2 mb-2">🌡️</div>
                  <h6 className="fw-bold">Smart Thermostat Rebate</h6>
                  <p className="small text-muted">Rebate for installing energy-efficient smart thermostats</p>
                  <span className="badge bg-success">Up to $100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;