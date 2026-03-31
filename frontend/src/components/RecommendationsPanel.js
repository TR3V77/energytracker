import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendations } from "../services/api";
import { flattenRecommendationsPayload } from "../utils/recommendations";

const RecommendationsPanel = ({ limit = 3 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await getRecommendations({});
      const raw = response.data?.recommendations ?? response.data ?? [];
      const flat = flattenRecommendationsPayload(raw);
      setRecommendations(flat.slice(0, limit));
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.response?.data?.error || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority) => {
    const priorityLower = priority?.toLowerCase() || "low";
    switch (priorityLower) {
      case "high":
        return { badge: "bg-danger", icon: "🔴", text: "High Priority", border: "border-danger", bg: "bg-danger bg-opacity-10" };
      case "medium":
        return { badge: "bg-warning text-dark", icon: "🟡", text: "Medium Priority", border: "border-warning", bg: "bg-warning bg-opacity-10" };
      default:
        return { badge: "bg-success", icon: "🟢", text: "Low Priority", border: "border-success", bg: "bg-success bg-opacity-10" };
    }
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body text-center py-4">
          <p className="text-danger mb-0 small">⚠️ {error}</p>
          <button className="btn btn-sm btn-link p-0 mt-2" onClick={fetchRecommendations}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body text-center py-4">
          <div className="display-6 mb-2">💡</div>
          <h6 className="fw-bold mb-1">No Recommendations</h6>
          <p className="text-muted small mb-0">Upload data to get recommendations.</p>
          <Link to="/upload" className="btn btn-sm btn-outline-primary mt-3 rounded-pill">
            Upload Data
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0 pt-3 px-3 d-flex justify-content-between align-items-center">
        <h6 className="fw-bold mb-0">
          <span className="me-1">💡</span> Recommendations
        </h6>
        <span className="badge bg-primary rounded-pill small">{recommendations.length}</span>
      </div>
      <div className="card-body p-3">
        <div className="recommendations-list" style={{ maxHeight: "380px", overflowY: "auto" }}>
          {recommendations.map((rec) => {
            const styles = getPriorityStyles(rec.priority);
            const preview = (rec.message || rec.reason || "").trim();
            const previewText =
              preview.length > 100 ? `${preview.slice(0, 100)}…` : preview || "—";
            return (
              <div
                key={rec.rowKey}
                className={`recommendation-item p-2 mb-2 rounded-2 border-start border-3 ${styles.border} ${styles.bg}`}
                style={{ borderLeftWidth: "3px" }}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="fw-bold small">{rec.neighborhood || "General"}</span>
                  <span className={`badge ${styles.badge} rounded-pill small px-2 py-0`}>
                    {styles.icon} {styles.text.split(" ")[0]}
                  </span>
                </div>
                <p className="mb-1 small text-muted">{previewText}</p>
                {rec.action && (
                  <div className="mt-1">
                    <small className="text-muted">
                      <span className="fw-bold">Action:</span> {rec.action}
                    </small>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pb-3 pt-0 px-3">
        <Link to="/recommendations" className="btn btn-link text-decoration-none p-0 small">
          View all recommendations →
        </Link>
      </div>
    </div>
  );
};

export default RecommendationsPanel;