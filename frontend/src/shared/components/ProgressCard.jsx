import React from "react";
import { ProgressBar, ProgressBarLegend } from "./ProgressBar";

/**
 * ProgressCard Component
 * Render a card containing progress information
 * 
 * This component is completely reusable across any feature
 * that needs to display progress (dashboard, admin, reports, etc.)
 */
export const ProgressCard = ({ 
  title = "Progress", 
  total, 
  completed, 
  segments = [], 
  legendItems = [] 
}) => {
  const completedPercent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted fw-bold">{title}</small>
          <small className="text-muted">
            {completed}/{total} completed ({Math.round(completedPercent)}%)
          </small>
        </div>
        
        {/* Progress Bar */}
        <ProgressBar segments={segments} height="8px" />
        
        {/* Legend */}
        <ProgressBarLegend items={legendItems} />
      </div>
    </div>
  );
};