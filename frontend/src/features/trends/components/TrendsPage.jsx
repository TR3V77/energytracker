import React from "react";
import { useTrendsData } from "../hooks/useTrendsData";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ErrorDisplay } from "../../../shared/components/ErrorDisplay";
import { TrendsTable } from "./TrendsTable";
import { TrendsSummary } from "./TrendsSummary";
import { TrendsChart } from "./TrendsChart";

export const TrendsPage = () => {
  const {
    trends, neighborhoods, selectedNeighborhood, setSelectedNeighborhood,
    summary, loading, error, refetch
  } = useTrendsData();

  if (loading) return <LoadingSpinner message="Loading trend data..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} title="Failed to Load Trends" />;
  if (!trends || trends.length === 0) {
    return (
      <div className="text-center py-5">
        <h3 className="fw-bold mb-3">No Trend Data Available</h3>
        <p className="text-muted">Upload energy data to see consumption trends.</p>
      </div>
    );
  }

  return (
    <div className="trends-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Trend Analysis</h2>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: "260px" }}
          value={selectedNeighborhood}
          onChange={(e) => setSelectedNeighborhood(e.target.value)}
        >
          <option value="all">All Neighborhoods</option>
          {neighborhoods.map((n) => (
            <option key={n.neighborhood_id} value={n.neighborhood_id}>
              {n.neighborhood_name}
            </option>
          ))}
        </select>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <TrendsTable trends={trends} />
        </div>
        <div className="col-lg-5">
          {summary && <TrendsSummary summary={summary} />}
        </div>
      </div>

      <TrendsChart trends={trends} />
    </div>
  );
};

export default TrendsPage;
