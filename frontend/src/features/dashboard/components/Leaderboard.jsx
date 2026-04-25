import { useEffect, useState } from "react";
import { getEfficiencyRankings } from "../../../services/api";
import { normalizeLeaderboardPayload } from "../../leaderboard/utils/leaderboardPayload";

function Leaderboard() {
  const [data, setData] = useState([]);   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowLabel, setWindowLabel] = useState(null);

  useEffect(() => {
    getEfficiencyRankings()
      .then((res) => {
        const payload = normalizeLeaderboardPayload(res?.data);
        setData(payload.rows);
        setWindowLabel(payload.window ? String(payload.window) : null);
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
    <>
      {windowLabel && <p className="text-muted mb-2">Window: {windowLabel}</p>}
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
    </>
  );
}

export default Leaderboard;