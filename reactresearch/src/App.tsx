import { useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import EfficiencyRankings from "./components/EfficiencyRankings";
import DataUpload from "./components/DataUpload";
import TrendAnalysis from "./components/TrendAnalysis";
import Recommendations from "./components/Recommendations";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  let items = ["New York", "San Fransisco", "Tokyo", "London", "Paris"];
  return (
    <div>
      <ListGroup items={items} heading="Cities" />
    </div>
  );
}

export default App;
