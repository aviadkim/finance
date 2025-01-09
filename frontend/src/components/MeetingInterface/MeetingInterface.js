import React, { useState } from 'react';
import './MeetingInterface.css';

function MeetingInterface() {
  const [currentStep, setCurrentStep] = useState('client-info');
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
      }
    ]
  });
  
  const [isRecording, setIsRecording] = useState(false);

  const steps = [
    { id: 'client-info', title: 'פרטי לקוח' },
    { id: 'regulatory', title: 'שאלות רגולטוריות' },
    { id: 'summary', title: 'סיכום והמלצות' }
  ];

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="meeting-interface">
      {/* Progress Steps */}
      <div className="progress-steps">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`step ${currentStep === step.id ? 'active' : ''}`}
            onClick={() => setCurrentStep(step.id)}
          >
            <div className="step-number">{steps.indexOf(step) + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Recording Control */}
      <div className="recording-control">
        <button 
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={handleRecordingToggle}
        >
          {isRecording ? '• מקליט' : '▶ התחל הקלטה'}
        </button>
        {isRecording && (
          <div className="live-transcript">
            מתמלל בזמן אמת...
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {currentStep === 'client-info' && (
          <div className="client-info-section">
            <h3>פרטי לקוח</h3>
            <div className="form-group">
              <label>שם לקוח</label>
              <input 
                type="text"
                value={formData.clientInfo.name}
                onChange={(e) => setFormData({
                  ...formData,
                  clientInfo: { ...formData.clientInfo, name: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label>מספר זהות</label>
              <input 
                type="text"
                value={formData.clientInfo.id}
                onChange={(e) => setFormData({
                  ...formData,
                  clientInfo: { ...formData.clientInfo, id: e.target.value }
                })}
              />
            </div>
          </div>
        )}

        {currentStep === 'regulatory' && (
          <div className="regulatory-section">
            <h3>שאלות רגולטוריות</h3>
            {formData.regulatoryQuestions.map((question) => (
              <div key={question.id} className="question-card">
                <div className="question-category">{question.category}</div>
                <div className="question-text">{question.question}</div>
                <div className="answer-buttons">
                  <button 
                    className={question.answer === 'yes' ? 'selected' : ''}
                    onClick={() => {
                      const updatedQuestions = formData.regulatoryQuestions.map(q =>
                        q.id === question.id ? { ...q, answer: 'yes' } : q
                      );
                      setFormData({ ...formData, regulatoryQuestions: updatedQuestions });
                    }}
                  >
                    כן
                  </button>
                  <button 
                    className={question.answer === 'no' ? 'selected' : ''}
                    onClick={() => {
                      const updatedQuestions = formData.regulatoryQuestions.map(q =>
                        q.id === question.id ? { ...q, answer: 'no' } : q
                      );
                      setFormData({ ...formData, regulatoryQuestions: updatedQuestions });
                    }}
                  >
                    לא
                  </button>
                </div>
                {question.aiDetected && (
                  <div className="ai-badge">זוהה ע"י AI</div>
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 'summary' && (
          <div className="summary-section">
            <h3>סיכום והמלצות</h3>
            <div className="form-group">
              <label>סיכום פגישה</label>
              <textarea 
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="הכנס סיכום פגישה..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        {currentStep !== steps[0].id && (
          <button 
            onClick={() => setCurrentStep(steps[steps.findIndex(s => s.id === currentStep) - 1].id)}
          >
            הקודם
          </button>
        )}
        {currentStep !== steps[steps.length - 1].id && (
          <button 
            onClick={() => setCurrentStep(steps[steps.findIndex(s => s.id === currentStep) + 1].id)}
          >
            הבא
          </button>
        )}
        {currentStep === steps[steps.length - 1].id && (
          <button className="finish-button">
            סיים פגישה
          </button>
        )}
      </div>
    </div>
  );
}

export default MeetingInterface;