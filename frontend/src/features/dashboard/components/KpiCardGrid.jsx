import React from "react";

const ColoredKpiCard = ({ title, value, unit, gradient, icon, subtitle }) => (
  <div className="col-md-3">
    <div className="card border-0 shadow-sm h-100" style={{ background: gradient }}>
      <div className="card-body text-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-white-50 text-uppercase small fw-bold mb-0">{title}</h6>
          <span 
            className="badge bg-white rounded-pill px-3" 
            style={{ 
              color: gradient.includes('0066cc') ? '#0066cc' : 
                     gradient.includes('28a745') ? '#28a745' : 
                     gradient.includes('fd7e14') ? '#fd7e14' : '#dc3545' 
            }}
          >
            {icon}
          </span>
        </div>
        <h2 className="display-6 fw-bold mb-2 text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h2>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-white-50">{unit}</span>
          {subtitle && <span className="text-white-50 small">{subtitle}</span>}
        </div>
      </div>
    </div>
  </div>
);

export const KpiCardGrid = ({ totalKwh, averageKwh, peakKwh, efficiencyScore, efficiencyRating, recordCount }) => (
  <div className="row g-4 mb-4">
    <ColoredKpiCard 
      title="Total Consumption"
      value={totalKwh}
      unit="kWh"
      gradient="linear-gradient(135deg, #0066cc, #004999)"
      icon="⚡"
      subtitle={`${recordCount} records`}
    />
    <ColoredKpiCard 
      title="Average Daily Usage"
      value={averageKwh}
      unit="kWh/day"
      gradient="linear-gradient(135deg, #28a745, #1e7b34)"
      icon="📅"
    />
    <ColoredKpiCard 
      title="Peak Day"
      value={peakKwh}
      unit="kWh"
      gradient="linear-gradient(135deg, #fd7e14, #dc3545)"
      icon="🔥"
    />
    <ColoredKpiCard 
      title="Neighborhood Efficiency"
      value={efficiencyScore?.toFixed(2) ?? '—'}
      unit="kWh/house"
      gradient={efficiencyRating.gradient}
      icon={efficiencyRating.icon}
      subtitle={efficiencyRating.label}
    />
  </div>
);