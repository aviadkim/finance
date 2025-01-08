import React, { useState } from 'react';

export function FileUploader({ onFileProcessed }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/process-audio-file', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      onFileProcessed(result);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="file-uploader">
      <h3>העלאת הקלטה קיימת</h3>
      <input 
        type="file" 
        accept="audio/*"
        onChange={handleFileUpload}
        disabled={isProcessing}
      />
      {isProcessing && <div>מעבד קובץ...</div>}
    </div>
  );
}