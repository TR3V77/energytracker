import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { path: "/rankings", label: "Rankings", icon: "📋" },
  { path: "/trends", label: "Trends", icon: "📈" },
  { path: "/recommendations", label: "Recommendations", icon: "💡" },
  { path: "/map", label: "Map", icon: "🗺️" },
];

const NavLink = ({ to, label, icon, isActive }) => (
  <li className="nav-item">
    <Link 
      className={`nav-link ${isActive ? "active" : ""}`} 
      to={to}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="me-1">{icon}</span>
      {label}
    </Link>
  </li>
);

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <span className="me-2">⚡</span>
          Energy Tracker
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                label={item.label}
                icon={item.icon}
                isActive={location.pathname === item.path}
              />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;