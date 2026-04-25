import React from "react";
import { StatCard } from "./StatCard";

/**
 * StatsGrid Component
 * Render a grid of stat cards
 * 
 * Completely reusable - accepts any array of stat configurations
 */
export const StatsGrid = ({ stats, columns = 6 }) => {
  if (!stats || stats.length === 0) {
    return (
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-4">
              <p className="text-muted mb-0">No statistics available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const colClass = `col-md-${Math.floor(12 / columns)} col-sm-4 col-6`;

  return (
    <div className="row g-4 mb-4">
      {stats.map((stat) => (
        <div key={stat.label} className={colClass}>
          <StatCard 
            value={stat.value}
            label={stat.label}
            colorClass={stat.colorClass}
            icon={stat.icon}
          />
        </div>
      ))}
    </div>
  );
};