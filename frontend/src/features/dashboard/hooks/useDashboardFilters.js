import { useState, useMemo } from "react";

export const useDashboardFilters = (energyData) => {
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState("all");

  const filteredData = useMemo(() => {
    const selectedNumericId = selectedNeighborhoodId === "all" ? null : Number(selectedNeighborhoodId);
    
    if (selectedNumericId === null) {
      return energyData;
    }
    
    return energyData.filter(d => Number(d.neighborhood_id) === selectedNumericId);
  }, [energyData, selectedNeighborhoodId]);

  const resetFilter = () => setSelectedNeighborhoodId("all");

  return {
    selectedNeighborhoodId,
    setSelectedNeighborhoodId,
    filteredData,
    resetFilter,
  };
};