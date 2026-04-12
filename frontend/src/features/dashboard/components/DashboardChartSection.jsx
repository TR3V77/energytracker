import React from "react";
import EnergyChart from "../../../shared/components/EnergyChart";
import { DashboardFilters } from "./DashboardFilters";

export const DashboardChartSection = ({ 
  filteredData, 
  selectedNeighborhoodId, 
  onNeighborhoodChange, 
  neighborhoods 
}) => (
  <div className="col-lg-8">
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-transparent border-0 pt-4 px-4">
        <DashboardFilters 
          selectedNeighborhoodId={selectedNeighborhoodId}
          onNeighborhoodChange={onNeighborhoodChange}
          neighborhoods={neighborhoods}
        />
      </div>
      <div className="card-body">
        {filteredData.length > 0 ? (
          <EnergyChart data={filteredData} />
        ) : (
          <div className="text-center py-5 bg-light rounded-3">
            <p className="text-muted mb-0">No data available for the selected neighborhood.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);