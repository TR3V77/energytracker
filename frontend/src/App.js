import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./navigation/components/Navbar";
import { HomePage } from "./features/home/components/HomePage";
import { DashboardPage } from "./features/dashboard/components/DashboardPage";
import { RankingsPage } from "./features/rankings/components/RankingsPage";
import { LeaderboardPage } from "./features/leaderboard/components/LeaderboardPage";
import { TrendsPage } from "./features/trends/components/TrendsPage";
import { RecommendationsPage } from "./features/recommendations/components/RecommendationsPage";
import { ComparePage } from "./features/compare/components/ComparePage";
import { EnergyMapPage } from "./features/map";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/map" element={<EnergyMapPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
