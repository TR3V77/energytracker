import React from "react";

const Recommendations = () => {
  const recommendations = [
    {
      neighborhood: "Downtown",
      score: 320,
      message:
        "Downtown is performing well! Consider promoting as a sustainability model.",
      action: "Community Recognition",
      priority: "low",
    },
    {
      neighborhood: "Riverside",
      score: 355,
      message:
        "Riverside uses 25% more energy than average. Recommend insulation improvements and energy audits.",
      action: "Schedule Energy Audit",
      priority: "medium",
    },
    {
      neighborhood: "North Hills",
      score: 378,
      message:
        "Solar adoption potential high. Recommend solar panel rebate program outreach.",
      action: "Solar Initiative",
      priority: "medium",
    },
    {
      neighborhood: "Westside",
      score: 412,
      message:
        "High consumption detected. Recommend HVAC upgrades and smart thermostat installation.",
      action: "Efficiency Upgrade",
      priority: "high",
    },
    {
      neighborhood: "East End",
      score: 445,
      message:
        "Critical efficiency level. Immediate intervention needed. Consider weatherization assistance.",
      action: "Emergency Assessment",
      priority: "high",
    },
  ];

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <div className="recommendations">
      <h2 className="mb-4">AI-Powered Recommendations</h2>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Neighborhood-Specific Recommendations</h5>
            </div>
            <div className="card-body">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`alert alert-${getPriorityClass(rec.priority)} mb-3`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="alert-heading">{rec.neighborhood}</h5>
                      <p className="mb-1">{rec.message}</p>
                      <small>Efficiency Score: {rec.score} kWh/household</small>
                    </div>
                    <span
                      className={`badge bg-${getPriorityClass(rec.priority)}`}
                    >
                      {rec.priority.toUpperCase()} Priority
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      Recommended Action: <strong>{rec.action}</strong>
                    </span>
                    <button className="btn btn-sm btn-outline-primary">
                      Implement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Priority Breakdown</h6>
                <div className="progress mb-2" style={{ height: "25px" }}>
                  <div
                    className="progress-bar bg-danger"
                    style={{ width: "40%" }}
                  >
                    High: 40%
                  </div>
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: "40%" }}
                  >
                    Medium: 40%
                  </div>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: "20%" }}
                  >
                    Low: 20%
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h6>Common Recommendations</h6>
                <ul className="list-group">
                  <li className="list-group-item">
                    🔧 Insulation Improvements (3 neighborhoods)
                  </li>
                  <li className="list-group-item">
                    ☀️ Solar Panel Rebates (2 neighborhoods)
                  </li>
                  <li className="list-group-item">
                    🌡️ Smart Thermostats (4 neighborhoods)
                  </li>
                  <li className="list-group-item">
                    ⚡ HVAC Upgrades (2 neighborhoods)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5>Rebate Opportunities</h5>
              <p className="text-muted">Available programs in your area:</p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  ✅ Energy Star Appliance Rebate - Up to $200
                </li>
                <li className="mb-2">
                  ✅ Solar Installation Credit - 26% Federal Tax Credit
                </li>
                <li className="mb-2">
                  ✅ Weatherization Assistance - Free for qualifying
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
