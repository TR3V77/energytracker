import React from "react";
import { Link } from "react-router-dom";

export const HeroSection = () => (
  <div 
    className="hero text-center mb-5 p-5 rounded-4 shadow-sm" 
    style={{ 
      background: "linear-gradient(135deg, #2c3e50 0%, #004999 100%)", 
      color: "#fff" 
    }}
  >
    <h1 className="display-4 fw-bold mb-3">
      ⚡ Energy Tracker
    </h1>
    <p className="lead mx-auto mb-4" style={{ maxWidth: "620px" }}>
      Monitor neighborhood energy consumption, identify efficiency trends,
      and get data-driven recommendations to reduce usage.
    </p>
    <Link 
      to="/dashboard" 
      className="btn btn-light btn-lg fw-semibold px-4 py-2 rounded-pill"
    >
      Go to Dashboard →
    </Link>
  </div>
);