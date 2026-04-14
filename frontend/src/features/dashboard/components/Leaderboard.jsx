import { useEffect, useState } from "react";
import Leaderboard from "./components/Leaderboard";
console.log("Leaderboard mounted");

function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/analytics/rankings")
    .then(res => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
})

  
      .then(data => {
        setData(data.rankings);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>{error}</p>;
  if (data.length === 0) return <p>No leaderboard data</p>;


  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Neighborhood</th>
          <th>Efficiency</th>
          <th>Households</th>
          <th>Total kWh</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.neighborhood_id}>
            <td>{row.rank}</td>
            <td>{row.neighborhood_name}</td>
            <td>{Number(row.efficiency).toFixed(2)}</td>
            <td>{row.households}</td>
            <td>{row.total_kwh}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Leaderboard;
