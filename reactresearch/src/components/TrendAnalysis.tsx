import React from "react";

const TrendAnalysis = () => {
  const trends = [
    {
      neighborhood: "Downtown",
      jan: 12000,
      feb: 11000,
      change: -8.3,
      trend: "down",
    },
    {
      neighborhood: "Riverside",
      jan: 8900,
      feb: 9200,
      change: 3.4,
      trend: "up",
    },
    {
      neighborhood: "North Hills",
      jan: 15600,
      feb: 14900,
      change: -4.5,
      trend: "down",
    },
    {
      neighborhood: "Westside",
      jan: 14300,
      feb: 15100,
      change: 5.6,
      trend: "up",
    },
  ];

  return (
    <div className="trend-analysis">
      <h2 className="mb-4">Trend Analysis</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Month-over-Month Changes</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Neighborhood</th>
                    <th>January</th>
                    <th>February</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((trend, index) => (
                    <tr key={index}>
                      <td>{trend.neighborhood}</td>
                      <td>{trend.jan.toLocaleString()} kWh</td>
                      <td>{trend.feb.toLocaleString()} kWh</td>
                      <td>
                        <span
                          className={
                            trend.trend === "up"
                              ? "text-danger"
                              : "text-success"
                          }
                        >
                          {trend.trend === "up" ? "↑" : "↓"}{" "}
                          {Math.abs(trend.change)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Summary Statistics</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Overall Trend</h6>
                <div className="progress mb-2" style={{ height: "30px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: "60%" }}
                  >
                    Decreasing: 60%
                  </div>
                  <div
                    className="progress-bar bg-danger"
                    style={{ width: "40%" }}
                  >
                    Increasing: 40%
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h6>Key Insights</h6>
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Average Monthly Change
                    <span className="badge bg-primary rounded-pill">
                      -0.95%
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Most Improved
                    <span className="badge bg-success rounded-pill">
                      Downtown ↓8.3%
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Needs Attention
                    <span className="badge bg-warning rounded-pill">
                      Westside ↑5.6%
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5>Historical Trend Chart</h5>
          <div className="chart-placeholder text-center p-5 bg-light">
            <h4>📈 Line Chart Placeholder</h4>
            <p>6-month trend visualization for each neighborhood</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;
