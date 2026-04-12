import React from "react";
import { EFFICIENCY_THRESHOLDS } from "../constants/rankingsConfig";

export const RankingsExplanation = () => (
  <div className="card border-0 shadow-sm mt-4">
    <div className="card-body">
      <h5 className="fw-bold mb-3">📖 How Efficiency Scores Work</h5>
      
      <div className="row g-4">
        <div className="col-md-6">
          <h6 className="fw-semibold">Calculation Method</h6>
          <p className="text-muted small mb-0">
            <strong>Efficiency Score = Total kWh ÷ Number of Households</strong>
          </p>
          <div className="alert alert-info mt-3 mb-0 small">
            <strong>Example:</strong> Downtown: 784,000 kWh ÷ 2,450 households = 320 kWh/household
          </div>
        </div>
        
        <div className="col-md-6">
          <h6 className="fw-semibold">Efficiency Thresholds</h6>
          <ul className="list-unstyled small mb-0">
            <li className="mb-2">
              <span className="badge bg-success me-2">✅</span>
              Efficient: &lt; {EFFICIENCY_THRESHOLDS.EFFICIENT} kWh/household
            </li>
            <li className="mb-2">
              <span className="badge bg-warning me-2">⚠️</span>
              Average: {EFFICIENCY_THRESHOLDS.EFFICIENT} - {EFFICIENCY_THRESHOLDS.AVERAGE - 1} kWh/household
            </li>
            <li className="mb-2">
              <span className="badge bg-danger me-2">🔴</span>
              Needs Improvement: ≥ {EFFICIENCY_THRESHOLDS.AVERAGE} kWh/household
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);