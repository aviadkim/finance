import React, { useState, useEffect } from 'react';

export function RegulatoryTracker({ transcript }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Load regulatory questions
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  useEffect(() => {
    if (transcript) {
      // Analyze transcript for regulatory compliance
      fetch('/api/analyze-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      })
      .then(res => res.json())
      .then(data => setAnswers(data));
    }
  }, [transcript]);

  return (
    <div className="regulatory-tracker">
      <h2>מעקב שאלות רגולטוריות</h2>
      <div className="questions-list">
        {questions.map(q => (
          <div key={q.id} className={`question ${answers[q.id] ? 'answered' : ''}`}>
            <span className="question-text">{q.question}</span>
            <span className="status">{answers[q.id] ? '✓' : '⚠️'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}