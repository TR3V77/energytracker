import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          Energy Tracker
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Monitor neighborhood energy consumption, identify efficiency trends,
          and get data-driven recommendations to reduce usage.
        </p>
        <Link to="/dashboard" className="btn btn-primary btn-lg mt-3">
          Go to Dashboard
        </Link>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="display-6 mb-3">📊</div>
              <h5 className="card-title fw-bold">Dashboard</h5>
              <p className="card-text text-muted">
                View KPIs, daily consumption charts, and filter by
                neighborhood, time window, and granularity.
              </p>
              <Link to="/dashboard" className="btn btn-outline-primary btn-sm">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="display-6 mb-3">💡</div>
              <h5 className="card-title fw-bold">Recommendations</h5>
              <p className="card-text text-muted">
                Get rule-based efficiency recommendations for each
                neighborhood based on real consumption data.
              </p>
              <Link to="/recommendations" className="btn btn-outline-primary btn-sm">
                View Recommendations
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="display-6 mb-3">🏆</div>
              <h5 className="card-title fw-bold">Rankings</h5>
              <p className="card-text text-muted">
                Compare neighborhoods by efficiency score and track
                which areas are performing best.
              </p>
              <Link to="/rankings" className="btn btn-outline-primary btn-sm">
                View Rankings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">How It Works</h5>
              <div className="d-flex align-items-start mb-3">
                <span className="badge bg-primary rounded-pill me-3 mt-1">1</span>
                <div>
                  <strong>Collect</strong>
                  <p className="text-muted mb-0 small">Energy records are stored per neighborhood with daily kWh readings.</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <span className="badge bg-primary rounded-pill me-3 mt-1">2</span>
                <div>
                  <strong>Analyze</strong>
                  <p className="text-muted mb-0 small">The system calculates efficiency scores and identifies consumption patterns.</p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <span className="badge bg-primary rounded-pill me-3 mt-1">3</span>
                <div>
                  <strong>Recommend</strong>
                  <p className="text-muted mb-0 small">Neighborhoods receive prioritized recommendations based on their efficiency band.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Tech Stack</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <strong>Frontend:</strong> <span className="text-muted">React, Bootstrap 5, Recharts</span>
                </li>
                <li className="mb-2">
                  <strong>Backend:</strong> <span className="text-muted">Flask, SQLAlchemy, PostgreSQL</span>
                </li>
                <li className="mb-2">
                  <strong>Infrastructure:</strong> <span className="text-muted">Docker Compose, Bitbucket Pipelines CI/CD</span>
                </li>
                <li className="mb-0">
                  <strong>Testing:</strong> <span className="text-muted">pytest, vitest, flake8</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
