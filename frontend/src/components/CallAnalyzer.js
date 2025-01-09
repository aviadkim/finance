import React, { useState } from 'react';

function CallAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const analyzeCall = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    
    // Mock analysis - יוחלף בהמשך בניתוח אמיתי
    setTimeout(() => {
      setAnalysis({
        summary: 'בשיחה נדונו הנושאים הבאים: עדכון צרכים, בחינת אפיק השקעה חדש',
        questions: [
          { question: 'זיהוי לקוח', found: true, timestamp: '0:15' },
          { question: 'בדיקת שינויים', found: true, timestamp: '1:23' },
          { question: 'הסבר סיכונים', found: true, timestamp: '3:45' },
          { question: 'תיעוד המלצות', found: true, timestamp: '5:12' },
        ],
        recommendations: [
          'המלצה להגדלת חשיפה למניות',
          'המלצה לבחינת אפיקי השקעה נוספים'
        ],
        emailDraft: `שלום רב,

בהמשך לשיחתנו היום, להלן סיכום הנושאים שנדונו:
1. עדכון צרכים שנתי
2. בחינת אפשרויות השקעה חדשות

ההמלצות שניתנו:
- הגדלת חשיפה למניות
- בחינת אפיקי השקעה נוספים

best regards,
Your Financial Advisor`
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="call-analyzer">
      <h3>ניתוח שיחה מוקלטת</h3>
      
      <div className="upload-section">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
        />
        <button 
          onClick={analyzeCall}
          disabled={!selectedFile || analyzing}
        >
          {analyzing ? 'מנתח...' : 'נתח שיחה'}
        </button>
      </div>

      {analysis && (
        <div className="analysis-results">
          <h4>תוצאות הניתוח</h4>
          
          <div className="summary-section">
            <h5>סיכום השיחה</h5>
            <p>{analysis.summary}</p>
          </div>

          <div className="questions-section">
            <h5>שאלות רגולטוריות שזוהו</h5>
            <ul>
              {analysis.questions.map((q, i) => (
                <li key={i}>
                  {q.question} - נמצא ב-{q.timestamp}
                </li>
              ))}
            </ul>
          </div>

          <div className="recommendations-section">
            <h5>המלצות שזוהו</h5>
            <ul>
              {analysis.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="email-draft-section">
            <h5>טיוטת אימייל ללקוח</h5>
            <textarea
              value={analysis.emailDraft}
              readOnly
              rows={10}
              style={{ width: '100%', direction: 'rtl' }}
            />
            <button onClick={() => console.log('Sending email...')}>שלח אימייל</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CallAnalyzer;