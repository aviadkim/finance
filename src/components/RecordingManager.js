import React, { useState, useEffect, useRef } from 'react';
import SummaryService from '../services/SummaryService';

const RecordingManager = () => {
  // ... existing state variables ...
  const [summary, setSummary] = useState(null);

  // In the stopRecording function, add:
  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      stopTimer();
      recognition.current?.stop();
      
      // Generate summary
      const meetingSummary = SummaryService.generateSummary(transcript, recordingTime);
      setSummary(meetingSummary);
    }
  };

  // In the return statement, add after transcript display:
  return (
    <div className="space-y-6">
      {/* ... existing recording controls and transcript display ... */}

      {summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">סיכום שיחה</h3>
          <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
            {SummaryService.formatSummaryText(summary)}
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => {/* Add email sending logic */}}
            >
              שלח במייל
            </button>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={() => {/* Add save to client profile logic */}}
            >
              שמור בתיק לקוח
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingManager;