import React from "react";
import { REBATE_OPPORTUNITIES } from "../constants/recommendationConfig";

const RebateCard = ({ icon, title, description, amount }) => (
  <div className="col-md-4">
    <div className="p-3 border rounded-3 h-100 shadow-sm">
      <div className="text-center mb-3">
        <div className="display-4 mb-2">{icon}</div>
        <h6 className="fw-bold mb-2">{title}</h6>
        <p className="small text-muted mb-3">{description}</p>
        <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">{amount}</span>
      </div>
    </div>
  </div>
);

export const RebateSection = () => {
  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-header bg-transparent border-0 pt-4 px-4">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4">💰</span>
          <h5 className="fw-bold mb-0">Available Rebate Opportunities</h5>
        </div>
        <p className="text-muted small mt-1 mb-0">
          Financial incentives to help implement energy efficiency improvements
        </p>
      </div>
      <div className="card-body pt-0">
        <div className="row g-3">
          {REBATE_OPPORTUNITIES.map((rebate, index) => (
            <RebateCard key={index} {...rebate} />
          ))}
        </div>
        <div className="mt-3 pt-2 text-center">
          <small className="text-muted">
            *Contact your local utility provider for eligibility requirements
          </small>
        </div>
      </div>
    </div>
  );
};