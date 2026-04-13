import React from "react";

export const RankingsWarnings = ({ warnings }) => (
  <div className="alert alert-warning mb-4" role="alert">
    <h6 className="alert-heading fw-bold mb-2">
      ⚠️ Neighborhoods Excluded from Rankings
    </h6>
    <p className="mb-2 small">
      The following neighborhoods were excluded due to invalid data:
    </p>
    <ul className="mb-0 small">
      {warnings.map((warning, idx) => (
        <li key={idx}>
          {warning.neighborhood_name} (ID: {warning.neighborhood_id}) - {warning.reason}
        </li>
      ))}
    </ul>
  </div>
);