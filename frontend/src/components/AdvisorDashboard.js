import React, { useState } from 'react';

function AdvisorDashboard() {
  const [activeRecording, setActiveRecording] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'האם זוהה הלקוח באופן מלא?',
      answered: false
    },
    {
      id: 2,
      question: 'האם נבדקו שינויים במצב הלקוח מאז השיחה האחרונה?',
      answered: false
    },
    {
      id: 3,
      question: 'האם נבדקו ניגודי עניינים?',
      answered: false
    },
    {
      id: 4,
      question: 'האם הוסברו כל הסיכונים הרלוונטיים?',
      answered: false
    },
    {
      id: 5,
      question: 'האם תועדו כל ההמלצות והנימוקים?',
      answered: false
    }
  ]);

  const toggleRecording = () => {
    setActiveRecording(!activeRecording);
  };

  const toggleQuestion = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? {...q, answered: !q.answered} : q
    ));
  };

  return (
    <div className="dashboard">
      <h2>דשבורד יועץ</h2>
      
      <div className="recording-section">
        <h3>הקלטת שיחה</h3>
        <button 
          onClick={toggleRecording}
          style={{ backgroundColor: activeRecording ? 'red' : 'green' }}
        >
          {activeRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
        </button>
      </div>

      <div className="questions-section">
        <h3>שאלות רגולטוריות</h3>
        {questions.map(q => (
          <div key={q.id} className="question-item">
            <input
              type="checkbox"
              checked={q.answered}
              onChange={() => toggleQuestion(q.id)}
            />
            <label>{q.question}</label>
          </div>
        ))}
      </div>

      <div className="actions-section">
        <h3>פעולות נוספות</h3>
        <button>שלח סיכום במייל</button>
        <button>צור דו"ח PDF</button>
        <button>שמור בארכיון</button>
      </div>
    </div>
  );
}

export default AdvisorDashboard;