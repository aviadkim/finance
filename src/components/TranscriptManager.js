import React, { useState } from 'react';

const TranscriptManager = () => {
  const [transcripts] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleStartTranscription = () => {
    setIsTranscribing(true);
    // Add transcription logic
  };

  return (
    <div>
      {transcripts.length === 0 ? (
        <div className="text-center p-8">
          <button
            onClick={handleStartTranscription}
            className={`${
              isTranscribing ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
            } text-white px-6 py-3 rounded-md text-lg`}
            disabled={isTranscribing}
          >
            {isTranscribing ? 'מתמלל...' : 'התחל תמלול'}
          </button>
          {!isTranscribing && (
            <p className="mt-4 text-gray-600">בחר הקלטה כדי להתחיל בתמלול</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {transcripts.map((transcript, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow"
            >
              <p>{transcript.text}</p>
              <div className="mt-2 text-sm text-gray-500">
                {transcript.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscriptManager;