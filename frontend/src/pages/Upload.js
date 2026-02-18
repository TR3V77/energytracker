import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { uploadFile } from '../services/api';

function Upload() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await uploadFile(formData);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setResult(null);
    }
  };

  return (
    <div>
      <h2>Upload Energy Dataset</h2>
      <p>Upload a CSV or JSON file containing energy consumption data.</p>
      <FileUpload onUpload={handleUpload} />
      {result && (
        <div className="upload-result">
          <h3>Upload Successful</h3>
          <p>File: {result.filename}</p>
          <p>Records imported: {result.record_count}</p>
          <p>Status: {result.status}</p>
        </div>
      )}
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}

export default Upload;
