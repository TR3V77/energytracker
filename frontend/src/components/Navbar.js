import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <h1>Energy Tracker</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/upload">Upload</Link></li>
        <li><Link to="/compare">Compare</Link></li>
        <li><Link to="/rankings">Rankings</Link></li>
        <li><Link to="/trends">Trends</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
