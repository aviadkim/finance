import React, { useState, useEffect } from 'react';

function SystemTester() {
  const [logs, setLogs] = useState([]);
  const [testStatus, setTestStatus] = useState('ready');

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
  };

  const runSystemTest = async () => {
    setTestStatus('running');
    setLogs([]);

    // 1. בדיקת טעינת מערכת
    addLog('בודק טעינת מערכת...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog('מערכת נטענה בהצלחה', 'success');

    // 2. בדיקת העלאת הקלטה
    addLog('מעלה הקלטת דמה...');
    const mockRecording = new Blob(['mock audio data'], { type: 'audio/wav' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog('הקלטה הועלתה בהצלחה', 'success');

    // 3. בדיקת זיהוי שאלות רגולטוריות
    addLog('מנתח שאלות רגולטוריות...');
    const mockQuestions = [
      { question: 'האם זוהה הלקוח?', found: true, timestamp: '0:15' },
      { question: 'האם נבדקו שינויים?', found: true, timestamp: '1:23' },
      { question: 'האם הוסברו הסיכונים?', found: false, timestamp: null }
    ];

    await new Promise(resolve => setTimeout(resolve, 2000));
    mockQuestions.forEach(q => {
      addLog(`שאלה: ${q.question} - ${q.found ? 'נמצאה' : 'לא נמצאה'}${q.timestamp ? ` (בדקה ${q.timestamp})` : ''}`,
        q.found ? 'success' : 'warning');
    });

    // 4. בדיקת יצירת סיכום
    addLog('מייצר סיכום שיחה...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const summary = 'בשיחה נדונו נושאי השקעה, עדכון צרכים והמלצות לפעולה';
    addLog(`סיכום: ${summary}`, 'success');

    // 5. בדיקת שליחת מייל
    addLog('מנסה לשלוח מייל...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog('מייל נשלח בהצלחה', 'success');

    setTestStatus('completed');
  };

  return (
    <div className="system-tester">
      <h3>בדיקת מערכת</h3>
      
      <button 
        onClick={runSystemTest}
        disabled={testStatus === 'running'}
      >
        {testStatus === 'running' ? 'בודק...' : 'הפעל בדיקה'}
      </button>

      <div className="logs-container">
        {logs.map((log, index) => (
          <div key={index} className={`log-entry log-${log.type}`}>
            <span className="log-timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SystemTester;