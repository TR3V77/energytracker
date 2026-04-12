import React from "react";
import { TECH_STACK } from "../constants/homeConfig";

export const TechStack = () => (
  <div className="card info-card border-0 shadow-sm h-100">
    <div className="card-body p-4">
      <h5 className="fw-bold mb-3">Tech Stack</h5>
      <div className="d-flex flex-column gap-2">
        {TECH_STACK.map((item) => (
          <div 
            key={item.category} 
            className="tech-item d-flex justify-content-between align-items-center p-2 rounded" 
            style={{ background: "#f8f9fa", borderRadius: "0.5rem" }}
          >
            <strong>{item.category}</strong>
            <span className="text-muted small">{item.technologies}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);