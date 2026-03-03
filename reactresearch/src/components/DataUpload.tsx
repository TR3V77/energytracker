import React, { useState } from "react";

const DataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      setUploadStatus("Processing...");
      // Simulate upload
      setTimeout(() => {
        setUploadStatus(
          "Upload complete! 245 records imported, 3 errors found.",
        );
      }, 2000);
    }
  };

  return (
    <div className="data-upload">
      <h2 className="mb-4">Upload Energy Data</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Upload CSV or JSON File</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="fileInput" className="form-label">
                  Select file to upload
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="fileInput"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                />
              </div>

              {file && (
                <div className="mb-3">
                  <p>
                    <strong>Selected file:</strong> {file.name}
                  </p>
                  <p>
                    <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!file}
              >
                Upload and Validate
              </button>

              {uploadStatus && (
                <div
                  className={`alert mt-3 ${uploadStatus.includes("complete") ? "alert-success" : "alert-info"}`}
                >
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Required Format</h5>
            </div>
            <div className="card-body">
              <h6>CSV Format Example:</h6>
              <pre className="bg-light p-3 rounded">
                {`neighborhood,date,energy_type,consumption_kWh,households
Downtown,2024-01-15,electric,12500,2450
Riverside,2024-01-15,gas,8900,1890`}
              </pre>

              <h6 className="mt-3">Required Columns:</h6>
              <ul>
                <li>
                  <code>neighborhood</code> - Name of the neighborhood
                </li>
                <li>
                  <code>date</code> - Date of measurement (YYYY-MM-DD)
                </li>
                <li>
                  <code>energy_type</code> - electric, gas, or solar
                </li>
                <li>
                  <code>consumption_kWh</code> - Energy consumed
                </li>
                <li>
                  <code>households</code> - Number of households
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Report */}
      <div className="card">
        <div className="card-header">
          <h5>Recent Upload History</h5>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Upload Date</th>
                <th>Records</th>
                <th>Errors</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>energy_data_jan2024.csv</td>
                <td>2024-01-31</td>
                <td>245</td>
                <td>0</td>
                <td>
                  <span className="badge bg-success">Success</span>
                </td>
              </tr>
              <tr>
                <td>neighborhood_data_q1.csv</td>
                <td>2024-02-15</td>
                <td>189</td>
                <td>3</td>
                <td>
                  <span className="badge bg-warning">Partial</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
