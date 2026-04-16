import { useEffect, useState } from "react";
import { getEfficiencyRankings } from "../../../services/api";

function Leaderboard() {
  const [data, setData] = useState([]);   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEfficiencyRankings()
      .then((res) => {
        const rows = res?.data?.rows;
        setData(Array.isArray(rows) ? rows : []);
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
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={`${row.rank}-${row.neighborhood}`}>
            <td>{row.rank}</td>
            <td>{row.neighborhood}</td>
            <td>{Number(row.efficiencyScore).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Leaderboard;