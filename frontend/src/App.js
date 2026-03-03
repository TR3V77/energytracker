import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Compare from './pages/Compare';
import EfficiencyRankings from './components/EfficiencyRankings';
import TrendAnalysis from './components/TrendAnalysis';
import Recommendations from './components/Recommendations';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/rankings" element={<EfficiencyRankings />} />
          <Route path="/trends" element={<TrendAnalysis />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
