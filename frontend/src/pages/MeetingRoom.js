import React, { useState, useEffect } from 'react';
import { useRecording } from '../hooks/useRecording';
import RegulatoryChecklist from '../components/RegulatoryChecklist';
import LiveTranscription from '../components/LiveTranscription';

function MeetingRoom() {
  const [transcript, setTranscript] = useState('');
  const { isRecording, startRecording, stopRecording } = useRecording(
    (newTranscript) => setTranscript(newTranscript)
  );

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">פגישה חדשה</h1>
        
        <div className="mb-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              התחל הקלטה
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              סיים הקלטה
            </button>
          )}
        </div>

        <LiveTranscription transcript={transcript} />
      </div>

      <div className="w-1/3 border-l p-4 bg-gray-50">
        <RegulatoryChecklist />
      </div>
    </div>
  );
}