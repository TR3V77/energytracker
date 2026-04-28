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
        
        if (response.data && Array.isArray(response.data.rows)) {
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

  // Add medal emojis for top 3 ranks
  const enrichedRankings = useMemo(() => {
    return rankings.map((item) => {
      let medal = null;
      if (item.rank === 1) medal = "🥇";
      else if (item.rank === 2) medal = "🥈";
      else if (item.rank === 3) medal = "🥉";
      
      return {
        ...item,
        medal,
      };
    });
  }, [rankings]);

  return { 
    rankings: enrichedRankings, 
    loading, 
    error, 
    refetch: () => window.location.reload() 
  };
};