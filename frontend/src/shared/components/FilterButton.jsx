import React from "react";

export const FilterButton = ({ active, label, icon, onClick }) => (
  <button
    type="button"
    className={`btn ${active ? "btn-primary" : "btn-outline-secondary"}`}
    onClick={onClick}
  >
    {icon && <span className="me-1">{icon}</span>}
    {label}
  </button>
);