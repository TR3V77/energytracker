import React from 'react';
import FileUpload from '../components/FileUpload';

function Upload() {
  const handleUpload = (file) => {
    // TODO: Call api.uploadFile(formData)
    console.log('Upload triggered for:', file.name);
  };

  return (
    <div>
      <h2>Upload Energy Dataset</h2>
      <p>Upload a CSV or JSON file containing energy consumption data.</p>
      <FileUpload onUpload={handleUpload} />
    </div>
  );
}

export default Upload;
