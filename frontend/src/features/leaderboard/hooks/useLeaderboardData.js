import { useState, useEffect, useMemo } from "react";
import { getEfficiencyRankings } from "../../../services/api";

export const useLeaderboardData = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEfficiencyRankings({});
        
        if (response.data && response.data.rows && Array.isArray(response.data.rows)) {
          setRankings(response.data.rows);
        } else {
          setRankings([]);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message || "Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  //Add medal emoji logic for top 3
  const enrichedRankings = useMemo(() => {
    return rankings.map((item, index) => ({
      ...item,
      medal: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null,
    }));
  }, [rankings]);

  return { 
    rankings: enrichedRankings, 
    loading, 
    error, 
    refetch: () => window.location.reload() 
  };
};