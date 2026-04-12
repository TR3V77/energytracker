import React from "react";
import { HOW_IT_WORKS_STEPS } from "../constants/homeConfig";

export const HowItWorks = () => (
  <div className="card info-card border-0 shadow-sm h-100">
    <div className="card-body p-4">
      <h5 className="fw-bold mb-3">How It Works</h5>
      {HOW_IT_WORKS_STEPS.map((step) => (
        <div key={step.number} className="d-flex align-items-start mb-3">
          <div 
            className="step-number me-3 mt-1" 
            style={{ 
              width: "28px", 
              height: "28px", 
              minWidth: "28px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, #0066cc, #004999)", 
              color: "#fff", 
              fontSize: "0.8rem", 
              fontWeight: 700 
            }}
          >
            {step.number}
          </div>
          <div>
            <strong>{step.title}</strong>
            <p className="text-muted mb-0 small">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);