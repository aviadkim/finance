import React, { useState } from 'react';

const TranscriptManager = () => {
  const [transcripts, setTranscripts] = useState([
    {
      id: 1,
      date: '2024-01-15',
      clientName: 'ישראל ישראלי',
      content: 'תמליל שיחה...',
      summary: 'סיכום השיחה...',
      questions: [
        { text: 'עדכון צרכים', answered: true },
        { text: 'דיון בסיכונים', answered: true },
        { text: 'שינויי השקעה', answered: false }
      ]
    }
  ]);

  const [selectedTranscript, setSelectedTranscript] = useState(null);

  const generateEmail = (transcript) => {
    return `
שלום ${transcript.clientName},

סיכום פגישתנו מתאריך ${transcript.date}:

${transcript.summary}

נקודות עיקריות לפעולה:
${transcript.questions
  .filter(q => !q.answered)
  .map(q => `- ${q.text}`)
  .join('\n')}

בברכה,
יועץ ההשקעות
    `;
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Transcript List */}
      <div className="col-span-4 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium mb-4">תמלילי שיחות</h2>
        <div className="space-y-2">
          {transcripts.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedTranscript(t)}
              className={`p-3 rounded-lg cursor-pointer ${
                selectedTranscript?.id === t.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{t.clientName}</div>
              <div className="text-sm text-gray-500">{t.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript Details */}
      {selectedTranscript ? (
        <div className="col-span-8 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">תמליל שיחה</h3>
            <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
              {selectedTranscript.content}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">סיכום</h3>
            <div className="bg-gray-50 p-4 rounded">
              {selectedTranscript.summary}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">שאלות רגולטוריות</h3>
            <div className="space-y-2">
              {selectedTranscript.questions.map((q, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={q.answered}
                    readOnly
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="mr-2">{q.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                const emailText = generateEmail(selectedTranscript);
                // Here we would normally send the email
                console.log(emailText);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              שלח סיכום במייל
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              ערוך תמליל
            </button>
          </div>
        </div>
      ) : (
        <div className="col-span-8 flex items-center justify-center text-gray-500">
          בחר תמליל להצגת פרטים
        </div>
      )}
    </div>
  );
};

export default TranscriptManager;