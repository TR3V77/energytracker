import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { 
  calculateTotalKwh, 
  calculateAverageKwh, 
  calculatePeakKwh, 
  calculateEfficiencyScore, 
  getEfficiencyRating, 
  calculateHouseholdsRepresented 
} from "../services/kpiCalculators";
import { DashboardHeader } from "./DashboardHeader";
import { KpiCardGrid } from "./KpiCardGrid";
import { DashboardChartSection } from "./DashboardChartSection";
import { DashboardSummaryStats } from "./DashboardSummaryStats";
import { DashboardRecommendationsPanel } from "./DashboardRecommendationsPanel";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ErrorDisplay } from "../../../shared/components/ErrorDisplay";
import { DashboardEmptyState } from "./DashboardEmptyState";

export const DashboardPage = () => {
  const { energyData, householdsByNeighborhoodId, sortedNeighborhoods, loading, error, refetch } = useDashboardData();
  const { selectedNeighborhoodId, setSelectedNeighborhoodId, filteredData } = useDashboardFilters(energyData);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} title="Failed to Load Dashboard" />;
  if (energyData.length === 0) return <DashboardEmptyState />;

  const totalKwh = calculateTotalKwh(filteredData);
  const averageKwh = calculateAverageKwh(filteredData);
  const peakKwh = calculatePeakKwh(filteredData);
  const householdsRepresented = calculateHouseholdsRepresented(filteredData, householdsByNeighborhoodId);
  const efficiencyScore = calculateEfficiencyScore(totalKwh, householdsRepresented);
  const efficiencyRating = getEfficiencyRating(efficiencyScore);

  return (
    <div className="dashboard">
      <DashboardHeader />
      
      <KpiCardGrid 
        totalKwh={totalKwh}
        averageKwh={averageKwh}
        peakKwh={peakKwh}
        efficiencyScore={efficiencyScore}
        efficiencyRating={efficiencyRating}
        recordCount={filteredData.length}
      />

      <div className="row g-4">
        <DashboardChartSection 
          filteredData={filteredData}
          selectedNeighborhoodId={selectedNeighborhoodId}
          onNeighborhoodChange={setSelectedNeighborhoodId}
          neighborhoods={sortedNeighborhoods}
        />
        <div className="col-lg-4">
          <DashboardRecommendationsPanel limit={3} />
        </div>
      </div>

      <DashboardSummaryStats 
        filteredData={filteredData}
        peakKwh={peakKwh}
        efficiencyScore={efficiencyScore}
        efficiencyRating={efficiencyRating}
      />
    </div>
  );
};

export default DashboardPage;