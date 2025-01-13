import React, { useState, useEffect } from 'react';

const RegulatoryFramework = ({ transcriptData }) => {
  const [regulatoryProgress, setRegulatoryProgress] = useState({
    'client_identification': {
      label: 'זיהוי לקוח',
      questions: [
        { id: 'verify_id', text: 'זיהוי לקוח באמצעות תעודה מזהה', asked: false, answered: false },
        { id: 'verify_details', text: 'עדכון פרטי לקוח במערכת', asked: false, answered: false }
      ]
    },
    'investment_needs': {
      label: 'בירור צרכים',
      questions: [
        { id: 'investment_goals', text: 'מטרות השקעה', asked: false, answered: false },
        { id: 'risk_tolerance', text: 'רמת סיכון מבוקשת', asked: false, answered: false },
        { id: 'investment_horizon', text: 'אופק השקעה', asked: false, answered: false },
        { id: 'financial_status', text: 'שינויים במצב פיננסי', asked: false, answered: false }
      ]
    },
    'disclosure': {
      label: 'גילוי נאות',
      questions: [
        { id: 'conflicts', text: 'ניגודי עניינים', asked: false, answered: false },
        { id: 'fees', text: 'עמלות ודמי ניהול', asked: false, answered: false },
        { id: 'risks', text: 'הסבר על סיכונים', asked: false, answered: false }
      ]
    }
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [completionStatus, setCompletionStatus] = useState(0);

  useEffect(() => {
    if (transcriptData && transcriptData.text) {
      processTranscript(transcriptData);
    }
  }, [transcriptData]);

  const processTranscript = (transcriptData) => {
    setRegulatoryProgress(prev => {
      const newProgress = { ...prev };
      
      Object.entries(newProgress).forEach(([categoryKey, category]) => {
        category.questions.forEach(question => {
          // בדיקה אם השאלה נשאלה
          if (transcriptData.text.toLowerCase().includes(question.text.toLowerCase())) {
            question.asked = true;
          }
          
          // בדיקה אם יש תשובה
          if (question.asked && !question.answered && 
              (transcriptData.text.includes('כן') || 
               transcriptData.text.includes('לא') ||
               transcriptData.text.includes('מסכים') ||
               transcriptData.text.includes('בסדר'))) {
            question.answered = true;
          }
        });
      });
      
      return newProgress;
    });

    updateCompletionStatus();
  };

  const updateCompletionStatus = () => {
    const allQuestions = Object.values(regulatoryProgress)
      .flatMap(category => category.questions);
    
    const answeredQuestions = allQuestions.filter(q => q.answered).length;
    setCompletionStatus(answeredQuestions / allQuestions.length);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-2">מעקב שיחה</h2>
      <div className="text-sm text-gray-600 mb-4">מעקב אחר נושאים שנדונו בשיחה</div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${completionStatus * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {Math.round(completionStatus * 100)}% מהנושאים נדונו
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(regulatoryProgress).map(([key, category]) => {
          const categoryCompletion = category.questions.filter(q => q.answered).length / category.questions.length;
          
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedCategory === key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{category.label}</div>
              <div className="text-sm text-gray-600 mt-1">
                {Math.round(categoryCompletion * 100)}% נדון
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Questions */}
      {selectedCategory && (
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">
            {regulatoryProgress[selectedCategory].label}
          </h3>
          <div className="space-y-3">
            {regulatoryProgress[selectedCategory].questions.map((question) => (
              <div key={question.id} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
                  question.answered 
                    ? 'bg-green-500 text-white'
                    : question.asked 
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200'
                }`}>
                  {question.answered ? '✓' : question.asked ? '!' : ''}
                </div>
                <div>
                  <div className={`font-medium ${
                    question.answered 
                      ? 'text-green-700'
                      : question.asked 
                        ? 'text-yellow-700'
                        : 'text-gray-700'
                  }`}>
                    {question.text}
                  </div>
                  <div className="text-sm text-gray-500">
                    {question.answered 
                      ? 'נדון בשיחה'
                      : question.asked 
                        ? 'נשאל - ממתין לתגובה'
                        : 'טרם נדון'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatoryFramework;