import { useState, useEffect, useMemo } from "react";
import { getEnergyData, getNeighborhoods } from "../../../services/api";

export const useDashboardData = () => {
  const [energyData, setEnergyData] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [energyRes, neighborhoodsRes] = await Promise.all([
          getEnergyData(),
          getNeighborhoods(),
        ]);
        setEnergyData(Array.isArray(energyRes.data) ? energyRes.data : []);
        setNeighborhoods(Array.isArray(neighborhoodsRes.data) ? neighborhoodsRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const householdsByNeighborhoodId = useMemo(() => {
    const map = {};
    neighborhoods.forEach(n => { map[n.neighborhood_id] = n.households; });
    return map;
  }, [neighborhoods]);

  const sortedNeighborhoods = useMemo(() => {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    return [...neighborhoods].sort((a, b) => {
      const byName = collator.compare(a.neighborhood_name, b.neighborhood_name);
      if (byName !== 0) return byName;
      return Number(a.neighborhood_id ?? 0) - Number(b.neighborhood_id ?? 0);
    });
  }, [neighborhoods]);

  return {
    energyData,
    neighborhoods,
    householdsByNeighborhoodId,
    sortedNeighborhoods,
    loading,
    error,
    refetch: () => window.location.reload(),
  };
};