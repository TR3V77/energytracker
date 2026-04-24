import React from "react";
import { Link } from "react-router-dom";

export const HeroSection = () => (
  <div
    className="hero text-center mb-5 p-5 rounded-4 shadow-sm"
    style={{
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      color: "#fff",
    }}
  >
    <h1 className="display-4 fw-bold mb-3">
      Energy Tracker
    </h1>
    <p className="lead mx-auto mb-4" style={{ maxWidth: "640px" }}>
      Monitor neighborhood energy consumption across the San Marcos area.
      Compare efficiency rankings, track month-over-month trends,
      and explore data-driven recommendations to reduce usage.
    </p>
    <div className="d-flex gap-3 justify-content-center">
      <Link
        to="/dashboard"
        className="btn btn-light btn-lg fw-semibold px-4 py-2 rounded-pill"
      >
        Go to Dashboard
      </Link>
      <Link
        to="/map"
        className="btn btn-outline-light btn-lg fw-semibold px-4 py-2 rounded-pill"
      >
        Explore Map
      </Link>
    </div>
  </div>
);
