import React, { useState } from 'react';
import './MeetingForm.css';

function MeetingForm() {
  const [activeSection, setActiveSection] = useState('clientInfo');
  const [formData, setFormData] = useState({
    clientInfo: {
      name: '',
      id: '',
      date: new Date().toISOString().split('T')[0]
    },
    regulatoryQuestions: [
      {
        id: 1,
        category: 'זיהוי לקוח',
        question: 'האם זוהה הלקוח באמצעות תעודת זהות?',
        answer: '',
        aiDetected: false
      },
      {
        id: 2,
        category: 'עדכון צרכים',
        question: 'האם חלו שינויים במצב המשפחתי?',
        answer: '',
        aiDetected: false
      },
      {
        id: 3,
        category: 'צרכי נזילות',
        question: 'האם הלקוח זקוק לנזילות בשנה הקרובה?',
        answer: '',
        aiDetected: false
      },
      {
        id: 4,
        category: 'הסברת סיכונים',
        question: 'האם הוסברו הסיכונים המרכזיים בתיק?',
        answer: '',
        aiDetected: false
      }
    ],
    recording: {
      isActive: false,
      transcript: ''
    },
    summary: '',
    nextMeeting: ''
  });

  const handleManualAnswer = (questionId, answer) => {
    setFormData(prev => ({
      ...prev,
      regulatoryQuestions: prev.regulatoryQuestions.map(q =>
        q.id === questionId ? { ...q, answer, aiDetected: false } : q
      )
    }));
  };

  const handleRecording = () => {
    setFormData(prev => ({
      ...prev,
      recording: {
        ...prev.recording,
        isActive: !prev.recording.isActive
      }
    }));
  };

  const sections = [
    { id: 'clientInfo', title: 'פרטי לקוח' },
    { id: 'questions', title: 'שאלות רגולטוריות' },
    { id: 'summary', title: 'סיכום והמלצות' }
  ];

  return (
    <div className="meeting-form">
      <div className="form-header">
        {sections.map(section => (
          <button
            key={section.id}
            className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.title}
          </button>
        ))}
      </div>

      <div className="recording-controls">
        <button 
          className={`record-btn ${formData.recording.isActive ? 'recording' : ''}`}
          onClick={handleRecording}
        >
          {formData.recording.isActive ? 'הפסק הקלטה' : 'התחל הקלטה'}
        </button>
        {formData.recording.isActive && <span className="recording-indicator">מקליט...</span>}
      </div>

      <div className="form-content">
        {activeSection === 'clientInfo' && (
          <div className="client-info-section">
            <input
              type="text"
              placeholder="שם לקוח"
              value={formData.clientInfo.name}
              onChange={e => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, name: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="מספר לקוח"
              value={formData.clientInfo.id}
              onChange={e => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, id: e.target.value }
              }))}
            />
          </div>
        )}

        {activeSection === 'questions' && (
          <div className="questions-section">
            {formData.regulatoryQuestions.map(q => (
              <div key={q.id} className="question-item">
                <div className="question-header">
                  <span className="category-tag">{q.category}</span>
                </div>
                <p className="question-text">{q.question}</p>
                <div className="answer-options">
                  <button
                    className={`answer-btn ${q.answer === 'yes' ? 'selected' : ''}`}
                    onClick={() => handleManualAnswer(q.id, 'yes')}
                  >
                    כן
                  </button>
                  <button
                    className={`answer-btn ${q.answer === 'no' ? 'selected' : ''}`}
                    onClick={() => handleManualAnswer(q.id, 'no')}
                  >
                    לא
                  </button>
                </div>
                {q.aiDetected && <span className="ai-badge">AI</span>}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'summary' && (
          <div className="summary-section">
            <textarea
              placeholder="סיכום פגישה"
              value={formData.summary}
              onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            />
            <input
              type="date"
              placeholder="תאריך פגישה הבאה"
              value={formData.nextMeeting}
              onChange={e => setFormData(prev => ({ ...prev, nextMeeting: e.target.value }))}
            />
          </div>
        )}
      </div>

      <div className="debug-panel">
        <h4>מידע לבדיקה</h4>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default MeetingForm;