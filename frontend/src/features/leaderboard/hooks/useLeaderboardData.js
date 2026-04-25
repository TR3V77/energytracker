import { useState, useEffect, useMemo } from "react";
import { getEfficiencyRankings } from "../../../services/api";
import {
  EMPTY_LEADERBOARD_PAYLOAD,
  normalizeLeaderboardPayload,
} from "../utils/leaderboardPayload";

export const useLeaderboardData = () => {
  const [leaderboardPayload, setLeaderboardPayload] = useState(EMPTY_LEADERBOARD_PAYLOAD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEfficiencyRankings({});
        setLeaderboardPayload(normalizeLeaderboardPayload(response?.data));
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message || "Failed to load leaderboard data");
        setLeaderboardPayload(EMPTY_LEADERBOARD_PAYLOAD);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  //Add medal emoji logic for top 3
  const enrichedRankings = useMemo(() => {
    return leaderboardPayload.rows.map((item, index) => ({
      ...item,
      medal: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null,
    }));
  }, [leaderboardPayload.rows]);

  return { 
    rankings: enrichedRankings, 
    generatedAt: leaderboardPayload.generatedAt,
    window: leaderboardPayload.window,
    loading, 
    error, 
    refetch: () => window.location.reload() 
  };
};