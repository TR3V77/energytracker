import { useState, useEffect, useMemo, useCallback } from "react";
import { getNeighborhoods, getEfficiencyRankings } from "../../../services/api";
import { getThresholds } from "../services/mapThresholdService";

export const useMapData = () => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [neighborhoodsRes, rankingsRes] = await Promise.all([
        getNeighborhoods(),
        getEfficiencyRankings({}),
      ]);

      const neighborhoods = Array.isArray(neighborhoodsRes.data)
        ? neighborhoodsRes.data
        : [];
      const rankings = rankingsRes.data?.rankings ?? [];

      const rankingMap = {};
      for (const r of rankings) {
        rankingMap[r.neighborhood_id] = r;
      }

      const combined = neighborhoods
        .filter((n) => n.latitude && n.longitude)
        .map((n) => ({
          ...n,
          efficiency: rankingMap[n.neighborhood_id]?.efficiency ?? null,
          total_kwh: rankingMap[n.neighborhood_id]?.total_kwh ?? null,
          rank: rankingMap[n.neighborhood_id]?.rank ?? null,
        }));

      setMapData(combined);
    } catch (err) {
      console.error("Error fetching map data:", err);
      setError(err.response?.data?.message || "Failed to load map data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const thresholds = useMemo(() => getThresholds(mapData), [mapData]);

  const sortedRankings = useMemo(
    () => [...mapData].filter((d) => d.efficiency !== null).sort((a, b) => a.efficiency - b.efficiency),
    [mapData]
  );

  return { mapData, thresholds, sortedRankings, loading, error, refetch: fetchData };
};
