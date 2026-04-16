import React from "react";
import { useMapData } from "../hooks/useMapData";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ErrorDisplay } from "../../../shared/components/ErrorDisplay";
import { MapLegend } from "./MapLegend";
import { MapView } from "./MapView";
import { MapRankingsTable } from "./MapRankingsTable";

export const EnergyMapPage = () => {
  const { mapData, thresholds, sortedRankings, loading, error, refetch } = useMapData();

  if (loading) return <LoadingSpinner message="Loading map data..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} title="Failed to Load Map" />;
  if (mapData.length === 0) {
    return (
      <div className="text-center py-5">
        <h3 className="fw-bold mb-3">No Map Data Available</h3>
        <p className="text-muted">Upload energy data and ensure neighborhoods have coordinates.</p>
      </div>
    );
  }

  return (
    <div className="energy-map">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Energy Efficiency Map</h2>
        <MapLegend />
      </div>
      <MapView mapData={mapData} thresholds={thresholds} />
      <MapRankingsTable rankings={sortedRankings} thresholds={thresholds} />
    </div>
  );
};

export default EnergyMapPage;
