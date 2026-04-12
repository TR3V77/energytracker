import { useState, useEffect, useCallback } from "react";
import { getRecommendations } from "../../../services/api";
import { flattenRecommendationsPayload } from "../../../utils/recommendationsUtils";

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecommendations({});
      const raw = response.data?.recommendations ?? response.data ?? [];
      const flattened = flattenRecommendationsPayload(raw);
      
      const withKeys = flattened.map((rec, idx) => ({
        ...rec,
        rowKey: rec.rowKey || rec.id || `rec_${idx}`,
      }));
      
      setRecommendations(withKeys);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.response?.data?.error || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, error, refetch: fetchRecommendations };
};