import React, { useState, useEffect } from 'react';

const DynamicQuestionnaire = ({ transcript, onQuestionUpdate }) => {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [transcriptKeywords, setTranscriptKeywords] = useState({});

  // Analyze transcript for keywords and update questions
  useEffect(() => {
    if (!transcript) return;

    const keywordAnalysis = analyzeTranscript(transcript);
    setTranscriptKeywords(prev => ({
      ...prev,
      ...keywordAnalysis
    }));

    // Update questions based on keywords
    updateQuestionsBasedOnKeywords(keywordAnalysis);
  }, [transcript]);

  const analyzeTranscript = (text) => {
    const keywords = {
      risk_related: text.includes('סיכון') || text.includes('הפסד') || text.includes('תנודתיות'),
      investment_goals: text.includes('מטרה') || text.includes('תשואה') || text.includes('רווח'),
      financial_status: text.includes('הכנסה') || text.includes('חיסכון') || text.includes('משכורת'),
      time_horizon: text.includes('טווח') || text.includes('שנים') || text.includes('תקופה'),
      liquidity: text.includes('נזילות') || text.includes('משיכה') || text.includes('כסף זמין')
    };

    return keywords;
  };

  const updateQuestionsBasedOnKeywords = (keywords) => {
    let nextQuestions = [];

    // Add identification questions first if not answered
    if (!answeredQuestions.identification) {
      nextQuestions.push({
        id: 'identification',
        text: 'האם ביצעת זיהוי מלא של הלקוח?',
        required: true
      });
    }

    // Add risk-related questions if risk keywords detected
    if (keywords.risk_related && !answeredQuestions.risk_profile) {
      nextQuestions.push({
        id: 'risk_profile',
        text: 'מהי רמת הסיכון המתאימה ללקוח?',
        subQuestions: [
          'האם הלקוח מבין את הסיכונים?',
          'מה ניסיון ההשקעות הקודם?'
        ]
      });
    }

    // Add investment goals questions if relevant keywords detected
    if (keywords.investment_goals && !answeredQuestions.investment_goals) {
      nextQuestions.push({
        id: 'investment_goals',
        text: 'מהן מטרות ההשקעה הספציפיות?',
        subQuestions: [
          'מהו טווח הזמן להשקעה?',
          'האם יש צורך בנזילות?'
        ]
      });
    }

    // Add financial status questions when relevant
    if (keywords.financial_status && !answeredQuestions.financial_status) {
      nextQuestions.push({
        id: 'financial_status',
        text: 'מהו המצב הפיננסי הנוכחי?',
        subQuestions: [
          'מהם מקורות ההכנסה?',
          'מהן ההתחייבויות הקיימות?'
        ]
      });
    }

    setCurrentQuestions(nextQuestions);
  };

  const handleAnswerQuestion = (questionId, answer) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Notify parent component
    onQuestionUpdate({
      questionId,
      answer,
      timestamp: new Date().toISOString()
    });

    // Move to next question
    const currentIndex = currentQuestions.findIndex(q => q.id === questionId);
    if (currentIndex < currentQuestions.length - 1) {
      setActiveQuestion(currentQuestions[currentIndex + 1].id);
    }
  };

  return (
    <div className="dynamic-questionnaire">
      <div className="current-questions">
        {currentQuestions.map(question => (
          <div 
            key={question.id} 
            className={`question-item ${activeQuestion === question.id ? 'active' : ''}`}
          >
            <h3>{question.text}</h3>
            
            {/* Main question response */}
            <div className="response-options">
              <button 
                onClick={() => handleAnswerQuestion(question.id, true)}
                className={answeredQuestions[question.id] === true ? 'selected' : ''}
              >
                כן
              </button>
              <button 
                onClick={() => handleAnswerQuestion(question.id, false)}
                className={answeredQuestions[question.id] === false ? 'selected' : ''}
              >
                לא
              </button>
            </div>

            {/* Sub-questions if any */}
            {question.subQuestions && answeredQuestions[question.id] && (
              <div className="sub-questions">
                {question.subQuestions.map((subQ, index) => (
                  <div key={index} className="sub-question">
                    <p>{subQ}</p>
                    <textarea 
                      placeholder="הוסף פרטים..."
                      onChange={(e) => handleAnswerQuestion(
                        `${question.id}_sub_${index}`, 
                        e.target.value
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicQuestionnaire;