import React from "react";

const EfficiencyRankings = () => {
  const rankings = [
    {
      rank: 1,
      neighborhood: "Downtown",
      efficiency: 320,
      households: 2450,
      totalKwh: 784000,
    },
    {
      rank: 2,
      neighborhood: "Riverside",
      efficiency: 355,
      households: 1890,
      totalKwh: 670950,
    },
    {
      rank: 3,
      neighborhood: "North Hills",
      efficiency: 378,
      households: 3200,
      totalKwh: 1209600,
    },
    {
      rank: 4,
      neighborhood: "Westside",
      efficiency: 412,
      households: 2800,
      totalKwh: 1153600,
    },
    {
      rank: 5,
      neighborhood: "East End",
      efficiency: 445,
      households: 2100,
      totalKwh: 934500,
    },
    {
      rank: 6,
      neighborhood: "South Park",
      efficiency: 489,
      households: 1950,
      totalKwh: 953550,
    },
  ];

  return (
    <div className="rankings">
      <h2 className="mb-4">Neighborhood Efficiency Rankings</h2>
      <p className="text-muted mb-4">
        Lower efficiency score = More efficient (kWh per household)
      </p>

      <div className="card">
        <div className="card-body">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Neighborhood</th>
                <th>Efficiency Score</th>
                <th>Total Households</th>
                <th>Total Consumption (kWh)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((item) => (
                <tr key={item.rank}>
                  <td>
                    <strong>#{item.rank}</strong>
                    {item.rank === 1 && <span className="ms-2">🏆</span>}
                  </td>
                  <td>{item.neighborhood}</td>
                  <td>
                    <span
                      className={`badge ${item.efficiency < 380 ? "bg-success" : item.efficiency < 430 ? "bg-warning" : "bg-danger"}`}
                    >
                      {item.efficiency} kWh/household
                    </span>
                  </td>
                  <td>{item.households.toLocaleString()}</td>
                  <td>{item.totalKwh.toLocaleString()} kWh</td>
                  <td>
                    {item.efficiency < 380 ? (
                      <span className="text-success">✅ Efficient</span>
                    ) : item.efficiency < 430 ? (
                      <span className="text-warning">⚠️ Average</span>
                    ) : (
                      <span className="text-danger">🔴 Needs Improvement</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5>Efficiency Score Calculation</h5>
          <p className="text-muted">
            Efficiency Score = Total kWh / Number of Households
          </p>
          <div className="alert alert-info">
            <strong>Example:</strong> Downtown: 784,000 kWh ÷ 2,450 households =
            320 kWh/household
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyRankings;
