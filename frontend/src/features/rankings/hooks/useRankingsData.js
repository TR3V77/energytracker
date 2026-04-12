import { useState, useEffect, useMemo } from "react";
import { getEfficiencyRankings } from "../../../services/api";
import { DEFAULT_RANKINGS } from "../constants/rankingsConfig";
import { calculateEfficiencyScore } from "../services/efficiencyCalculatorService";
import { getEfficiencyStatus } from "../services/efficiencyStatusService";
import { sortByEfficiencyAscending } from "../services/efficiencyCalculatorService";

export const useRankingsData = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEfficiencyRankings({});
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const transformed = response.data.map((item) => ({
            neighborhood_name: item.neighborhood_name || item.neighborhood || "Unknown",
            households: item.households || 0,
            total_kwh: item.total_kwh || 0,
            efficiency: calculateEfficiencyScore(item.total_kwh, item.households),
          }));
          setRankings(transformed);
          setUsingMockData(false);
        } else {
          setRankings(DEFAULT_RANKINGS);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setRankings(DEFAULT_RANKINGS);
        setUsingMockData(true);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRankings();
  }, []);

  const enrichedRankings = useMemo(() => {
    const sorted = sortByEfficiencyAscending(rankings);
    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
      status: getEfficiencyStatus(item.efficiency),
    }));
  }, [rankings]);

  return { rankings: enrichedRankings, loading, error, usingMockData, refetch: () => window.location.reload() };
};