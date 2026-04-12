import React from "react";
import { useTrendsData } from "../hooks/useTrendsData";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ErrorDisplay } from "../../../shared/components/ErrorDisplay";
import { TrendsHeader } from "./TrendsHeader";
import { TrendsTable } from "./TrendsTable";
import { TrendsSummary } from "./TrendsSummary";
import { TrendsChart } from "./TrendsChart";

export const TrendsPage = () => {
  const { trends, summary, loading, error, refetch } = useTrendsData();

  if (loading) return <LoadingSpinner message="Loading trend data..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} title="Failed to Load Trends" />;
  if (!trends || trends.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="display-1 mb-4">📈</div>
        <h3 className="fw-bold mb-3">No Trend Data Available</h3>
        <p className="text-muted">Upload energy data to see consumption trends.</p>
      </div>
    );
  }

  return (
    <div className="trends-page">
      <TrendsHeader />
      
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <TrendsTable trends={trends} />
        </div>
        <div className="col-lg-5">
          <TrendsSummary summary={summary} />
        </div>
      </div>

      <TrendsChart trends={trends} />
    </div>
  );
};

export default TrendsPage;