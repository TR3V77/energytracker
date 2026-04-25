import React from "react";
import { useLeaderboardData } from "../hooks/useLeaderboardData";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardTable } from "./LeaderboardTable";
import { LeaderboardLoadingState } from "./LeaderboardLoadingState";
import { LeaderboardEmptyState } from "./LeaderboardEmptyState";
import { LeaderboardErrorState } from "./LeaderboardErrorState";

export const LeaderboardPage = () => {
  const { rankings, generatedAt, window, loading, error, refetch } = useLeaderboardData();

  if (loading) return <LeaderboardLoadingState />;
  if (error) return <LeaderboardErrorState error={error} onRetry={refetch} />;
  if (rankings.length === 0) return <LeaderboardEmptyState />;

  return (
    <div className="leaderboard-page">
      <LeaderboardHeader generatedAt={generatedAt} window={window} />
      <LeaderboardTable rankings={rankings} />
      
      {/* Optional: Add a note about how efficiency is calculated */}
      <div className="mt-4 text-center">
        <small className="text-muted">
          💡 Efficiency Score = Total kWh ÷ Number of Households (Lower is better)
        </small>
      </div>
    </div>
  );
};

export default LeaderboardPage;