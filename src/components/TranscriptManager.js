import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const TranscriptManager = () => {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const q = query(collection(db, 'meetings'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const transcriptData = [];
      querySnapshot.forEach((doc) => {
        transcriptData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setTranscripts(transcriptData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transcripts:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4 text-center">
      שגיאה בטעינת התמלילים: {error}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">היסטוריית תמלילים</h2>
      
      {transcripts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          לא נמצאו תמלילים
        </div>
      ) : (
        <div className="grid gap-4">
          {transcripts.map((transcript) => (
            <div key={transcript.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">פגישה מתאריך {formatDate(transcript.timestamp)}</h3>
                  {transcript.summary && (
                    <div className="mt-2">
                      <h4 className="font-medium">נושאים:</h4>
                      <ul className="list-disc list-inside">
                        {transcript.summary.topics.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => window.open(`mailto:?subject=תמליל פגישה&body=${encodeURIComponent(transcript.summary?.summary || '')}`)} 
                  className="text-blue-500 hover:text-blue-600"
                >
                  שלח במייל
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {transcript.transcript.map((entry, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded ${entry.speaker === 'יועץ' ? 'bg-blue-50' : 'bg-green-50'}`}
                  >
                    <span className="font-bold">{entry.speaker}:</span>{' '}
                    <span>{entry.text}</span>
                    <div className="text-xs text-gray-500">
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscriptManager;