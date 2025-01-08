import React, { useState } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { FileUploader } from './FileUploader';
import { RegulatoryTracker } from './RegulatoryTracker';
import { TranscriptViewer } from './TranscriptViewer';

export function Dashboard() {
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('hebrew');

  const handleAudioProcessed = (result) => {
    setTranscript(result.transcript);
  };

  return (
    <div className="dashboard">
      <div className="language-selector">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="hebrew">עברית</option>
          <option value="english">English</option>
        </select>
      </div>
      
      <div className="recording-section">
        <AudioRecorder onAudioProcessed={handleAudioProcessed} language={language} />
        <FileUploader onFileProcessed={handleAudioProcessed} language={language} />
      </div>

      <div className="analysis-section">
        <RegulatoryTracker transcript={transcript} />
        <TranscriptViewer transcript={transcript} />
      </div>
    </div>
  );
}