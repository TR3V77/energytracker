import { useState, useEffect, useMemo, useCallback } from "react";
import { getTrends, getNeighborhoods } from "../../../services/api";

export const useTrendsData = () => {
  const [trends, setTrends] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedNeighborhood !== "all") {
        params.neighborhood_id = selectedNeighborhood;
      }
      const [trendsRes, neighborhoodsRes] = await Promise.all([
        getTrends(params),
        getNeighborhoods(),
      ]);
      const data = trendsRes.data?.trends ?? trendsRes.data ?? [];
      setTrends(data);
      const nhList = Array.isArray(neighborhoodsRes.data) ? neighborhoodsRes.data : [];
      setNeighborhoods(nhList);
    } catch (err) {
      console.error("Error fetching trends:", err);
      setError("Failed to load trend data");
    } finally {
      setLoading(false);
    }
  }, [selectedNeighborhood]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const summary = useMemo(() => {
    if (trends.length === 0) return null;

    const withChange = trends.filter(t => t.pct_change !== null);
    const increasing = withChange.filter(t => t.pct_change > 0);
    const decreasing = withChange.filter(t => t.pct_change < 0);
    const total = increasing.length + decreasing.length;
    const increasingPercentage = total > 0 ? Math.round((increasing.length / total) * 100) : 0;
    const decreasingPercentage = total > 0 ? 100 - increasingPercentage : 0;

    const averageChange = withChange.length > 0
      ? withChange.reduce((sum, t) => sum + t.pct_change, 0) / withChange.length
      : 0;

    const mostImproved = [...withChange].sort((a, b) => a.pct_change - b.pct_change)[0];
    const needsAttention = [...withChange].sort((a, b) => b.pct_change - a.pct_change)[0];

    return {
      increasingCount: increasing.length,
      decreasingCount: decreasing.length,
      increasingPercentage,
      decreasingPercentage,
      averageChange,
      mostImproved: mostImproved?.period,
      mostImprovedChange: mostImproved?.pct_change,
      needsAttention: needsAttention?.period,
      needsAttentionChange: needsAttention?.pct_change,
    };
  }, [trends]);

  return {
    trends,
    neighborhoods,
    selectedNeighborhood,
    setSelectedNeighborhood,
    summary,
    loading,
    error,
    refetch: fetchData,
  };
};
