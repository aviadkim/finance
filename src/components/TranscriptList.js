import React, { useState } from 'react';

const TranscriptList = () => {
  const [transcripts, setTranscripts] = useState([
    {
      id: 1,
      clientName: 'ישראל ישראלי',
      date: '2024-01-15',
      time: '14:30',
      duration: '45:20',
      hasTranscript: true,
      transcript: 'דוגמה לתמליל שיחה...'
    },
    {
      id: 2,
      clientName: 'שרה כהן',
      date: '2024-01-14',
      time: '10:15',
      duration: '32:10',
      hasTranscript: true,
      transcript: 'דוגמה נוספת לתמליל...'
    }
  ]);

  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">תמלילי שיחות</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="חיפוש לפי שם לקוח או תאריך..."
            className="w-full p-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Transcripts List */}
      <div className="space-y-4">
        {transcripts.map(transcript => (
          <div 
            key={transcript.id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedTranscript(transcript)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{transcript.clientName}</div>
                <div className="text-sm text-gray-600">
                  {transcript.date} • {transcript.time}
                </div>
                <div className="text-sm text-gray-600">
                  משך שיחה: {transcript.duration}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle download
                  }}
                >
                  הורד
                </button>
                <button 
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle email sending
                  }}
                >
                  שלח במייל
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transcript Modal */}
      {selectedTranscript && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{selectedTranscript.clientName}</h3>
                <div className="text-sm text-gray-600">
                  {selectedTranscript.date} • {selectedTranscript.time}
                </div>
              </div>
              <button 
                onClick={() => setSelectedTranscript(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Audio Player */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">הקלטה</h4>
              <audio controls className="w-full">
                <source src="#" type="audio/mpeg" />
              </audio>
            </div>

            {/* Transcript */}
            <div>
              <h4 className="font-medium mb-2">תמליל</h4>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {selectedTranscript.transcript}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setSelectedTranscript(null)}
              >
                סגור
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                שמור שינויים
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptList;