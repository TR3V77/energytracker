import React from "react";
import { useRankingsData } from "../hooks/useRankingsData";
import { RankingsHeader } from "./RankingsHeader";
import { RankingsTable } from "./RankingsTable";
import { RankingsExplanation } from "./RankingsExplanation";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ErrorDisplay } from "../../../shared/components/ErrorDisplay";
import { RankingsEmptyState } from "./RankingsEmptyState";
import { RankingsWarnings } from "./RankingsWarnings"; //new component

export const RankingsPage = () => {
  const { rankings, warnings, loading, error, usingMockData, refetch } = useRankingsData();

  if (loading) return <LoadingSpinner message="Loading rankings..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} title="Failed to Load Rankings" />;
  if (rankings.length === 0) return <RankingsEmptyState />;

  return (
    <div className="rankings-page">
      <RankingsHeader usingMockData={usingMockData} />
      
      {/*Show warnings if neighborhoods were excluded */}
      {warnings && warnings.length > 0 && (
        <RankingsWarnings warnings={warnings} />
      )}
      
      <RankingsTable rankings={rankings} />
      <RankingsExplanation />
    </div>
  );
};

export default RankingsPage;
