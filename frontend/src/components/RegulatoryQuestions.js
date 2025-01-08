import React, { useState, useEffect } from 'react';
import { useQuestions } from '../hooks/useQuestions';

const RegulatoryQuestions = ({ transcript }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const { loadQuestions, analyzeTranscript } = useQuestions();

  useEffect(() => {
    const fetchQuestions = async () => {
      const regulatoryQuestions = await loadQuestions();
      setQuestions(regulatoryQuestions);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (transcript) {
      analyzeTranscript(transcript).then(analysis => {
        setAnswers(prev => ({
          ...prev,
          ...analysis.answers
        }));
      });
    }
  }, [transcript]);

  return (
    <div className="regulatory-questions">
      <h2>שאלות רגולטוריות</h2>
      {questions.map((q) => (
        <div key={q.id} className="question-item">
          <h3>{q.question}</h3>
          <div className="status">
            {answers[q.id] ? '✓ נענה' : '⚠️ טרם נענה'}
          </div>
          {q.subQuestions?.map((sub, idx) => (
            <div key={idx} className="sub-question">
              <p>{sub}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RegulatoryQuestions;