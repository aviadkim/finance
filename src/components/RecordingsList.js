import React, { useState } from 'react';

export const RecordingsList = () => {
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      date: '2024-01-15',
      clientName: 'ישראל ישראלי',
      duration: '45:30',
      hasTranscript: true
    },
    {
      id: 2,
      date: '2024-01-14',
      clientName: 'שרה כהן',
      duration: '32:15',
      hasTranscript: true
    }
  ]);

  const [selectedRecording, setSelectedRecording] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Recordings List */}
        <div className="col-span-1 border-l">
          <h2 className="text-lg font-bold mb-4">הקלטות אחרונות</h2>
          <div className="space-y-3">
            {recordings.map(recording => (
              <div
                key={recording.id}
                onClick={() => setSelectedRecording(recording)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedRecording?.id === recording.id 
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{recording.clientName}</div>
                <div className="text-sm text-gray-500">
                  <span>{recording.date}</span>
                  <span className="mx-2">•</span>
                  <span>{recording.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recording Details */}
        <div className="col-span-2">
          {selectedRecording ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">{selectedRecording.clientName}</h3>
                <div className="text-sm text-gray-500">
                  תאריך: {selectedRecording.date}
                  <span className="mx-2">•</span>
                  משך: {selectedRecording.duration}
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                  הצג תמליל
                </button>
                <button className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
                  שלח סיכום במייל
                </button>
                <button className="w-full border border-gray-300 p-3 rounded-lg hover:bg-gray-50">
                  הורד הקלטה
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              בחר הקלטה להצגת פרטים
            </div>
          )}
        </div>
      </div>
    </div>
  );
};