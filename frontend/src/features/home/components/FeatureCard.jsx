import React from "react";
import { Link } from "react-router-dom";

export const FeatureCard = ({ icon, title, description, linkTo, linkText, gradient }) => (
  <div className="col-md-4">
    <div className="card feature-card h-100 border-0 shadow-sm">
      <div className="accent" style={{ background: gradient, height: "4px" }} />
      <div className="card-body text-center p-4">
        <div className="display-5 mb-3">{icon}</div>
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="card-text text-muted">{description}</p>
        <Link to={linkTo} className="btn btn-outline-primary btn-sm px-3 rounded-pill">
          {linkText}
        </Link>
      </div>
    </div>
  </div>
);