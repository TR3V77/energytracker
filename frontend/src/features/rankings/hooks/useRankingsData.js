import { useState, useEffect, useMemo } from "react";
import { getEfficiencyRankings } from "../../../services/api";
import { getEfficiencyStatus } from "../services/efficiencyStatusService";

export const useRankingsData = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEfficiencyRankings({});
        
        // Direct consumption of backend response
        if (response.data && response.data.rankings && Array.isArray(response.data.rankings) && response.data.rankings.length > 0) {
          // Backend already provides rank, neighborhood_name, efficiency, households, total_kwh
          setRankings(response.data.rankings);
          setWarnings(response.data.warnings || []);
          setUsingMockData(false);
        } else {
          // No data case - but keep structure consistent
          setRankings([]);
          setWarnings([]);
          setUsingMockData(false);
        }
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError(err.message || "Failed to load rankings");
        setUsingMockData(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRankings();
  }, []);

  // Only add status enrichment - no transformation needed
  const enrichedRankings = useMemo(() => {
    return rankings.map((item) => ({
      ...item,  // Keep all original fields: rank, neighborhood_name, efficiency, households, total_kwh
      status: getEfficiencyStatus(item.efficiency),
    }));
  }, [rankings]);

  return { 
    rankings: enrichedRankings, 
    warnings,
    loading, 
    error, 
    usingMockData, 
    refetch: () => window.location.reload() 
  };
};