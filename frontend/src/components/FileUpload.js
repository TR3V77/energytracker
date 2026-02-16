import React, { useState } from 'react';

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const ext = selected.name.split('.').pop().toLowerCase();
      if (!['csv', 'json'].includes(ext)) {
        setMessage('Please select a CSV or JSON file.');
        setFile(null);
        return;
      }
      setFile(selected);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    setMessage('Uploading...');
    await onUpload(file);
    setMessage('');
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
      />
      <button type="submit" disabled={!file}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default FileUpload;
