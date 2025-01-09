import React, { useState } from 'react';

function ClientHistory() {
  const [clientId, setClientId] = useState('');
  const [history, setHistory] = useState([]);

  // Mock data - יוחלף בהמשך בנתונים אמיתיים מ-Firebase/Google Drive
  const mockHistory = {
    '123': [
      {
        date: '2024-01-08',
        summary: 'עדכון צרכים שנתי',
        questions: [
          { question: 'האם זוהה הלקוח?', answered: true },
          { question: 'האם נבדקו שינויים?', answered: true }
        ],
        recordingUrl: 'recording1.mp3'
      },
      {
        date: '2023-12-15',
        summary: 'שיחת ייעוץ - המלצות השקעה',
        questions: [
          { question: 'האם הוסברו הסיכונים?', answered: true },
          { question: 'האם תועדו ההמלצות?', answered: true }
        ],
        recordingUrl: 'recording2.mp3'
      }
    ]
  };

  const searchClient = () => {
    const clientHistory = mockHistory[clientId] || [];
    setHistory(clientHistory);
  };

  return (
    <div className="client-history">
      <h3>היסטוריית לקוח</h3>
      <div className="search-section">
        <input
          type="text"
          placeholder="הכנס מספר לקוח"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <button onClick={searchClient}>חפש</button>
      </div>

      {history.length > 0 ? (
        <div className="history-list">
          {history.map((record, index) => (
            <div key={index} className="history-item">
              <h4>{record.date}</h4>
              <p><strong>סיכום:</strong> {record.summary}</p>
              <div className="questions-list">
                <strong>שאלות שנשאלו:</strong>
                <ul>
                  {record.questions.map((q, i) => (
                    <li key={i}>
                      {q.question} - {q.answered ? '✓' : '✗'}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => console.log(`Play recording: ${record.recordingUrl}`)}>נגן הקלטה</button>
            </div>
          ))}
        </div>
      ) : (
        clientId && <p>לא נמצאו רשומות עבור לקוח זה</p>
      )}
    </div>
  );
}

export default ClientHistory;