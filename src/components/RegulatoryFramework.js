import React, { useState, useEffect } from 'react';

const RegulatoryFramework = ({ transcriptData, onStatusChange }) => {
  const [regulatoryProgress, setRegulatoryProgress] = useState({
    requiredQuestions: {
      'client_identification': {
        label: 'זיהוי לקוח',
        questions: [
          { id: 'verify_id', text: 'האם זוהה הלקוח באמצעות תעודה מזהה', asked: false, answered: false },
          { id: 'verify_details', text: 'האם פרטי הלקוח מעודכנים במערכת', asked: false, answered: false }
        ]
      },
      'investment_needs': {
        label: 'בירור צרכי השקעה',
        questions: [
          { id: 'investment_goals', text: 'מטרות ההשקעה', asked: false, answered: false },
          { id: 'risk_tolerance', text: 'רמת הסיכון המבוקשת', asked: false, answered: false },
          { id: 'investment_horizon', text: 'אופק ההשקעה', asked: false, answered: false },
          { id: 'financial_status', text: 'שינוי במצב הפיננסי', asked: false, answered: false }
        ]
      },
      'disclosure': {
        label: 'גילוי נאות',
        questions: [
          { id: 'conflicts', text: 'גילוי על ניגודי עניינים', asked: false, answered: false },
          { id: 'fees', text: 'עמלות ודמי ניהול', asked: false, answered: false },
          { id: 'risks', text: 'הסברת הסיכונים', asked: false, answered: false }
        ]
      }
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
    if (transcriptData.speaker !== 'advisor') return;

    setRegulatoryProgress(prev => {
      const newProgress = { ...prev };
      
      Object.entries(newProgress.requiredQuestions).forEach(([categoryKey, category]) => {
        category.questions.forEach(question => {
          if (transcriptData.text.includes(question.text)) {
            question.asked = true;
          }
          
          if (question.asked && !question.answered && 
              transcriptData.speaker === 'client' &&
              (transcriptData.text.includes('כן') || 
               transcriptData.text.includes('לא') ||
               transcriptData.text.includes('מסכים') ||
               transcriptData.text.includes('אישור'))) {
            question.answered = true;
          }
        });
      });
      
      return newProgress;
    });

    updateCompletionStatus();
  };

  const updateCompletionStatus = () => {
    const allQuestions = Object.values(regulatoryProgress.requiredQuestions)
      .flatMap(category => category.questions);
    
    const answeredQuestions = allQuestions.filter(q => q.answered).length;
    const newStatus = answeredQuestions / allQuestions.length;
    
    setCompletionStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">מעקב דרישות רגולטוריות</h2>
      
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${completionStatus * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {Math.round(completionStatus * 100)}% מהדרישות הושלמו
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(regulatoryProgress.requiredQuestions).map(([key, category]) => {
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
                {Math.round(categoryCompletion * 100)}% הושלם
              </div>
            </button>
          );
        })}
      </div>

      {selectedCategory && (
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">
            {regulatoryProgress.requiredQuestions[selectedCategory].label}
          </h3>
          <div className="space-y-3">
            {regulatoryProgress.requiredQuestions[selectedCategory].questions.map((question) => (
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
                      ? 'הושלם'
                      : question.asked 
                        ? 'נשאל - ממתין לתשובה'
                        : 'טרם נשאל'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completionStatus < 1 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-yellow-700 font-medium">שים לב!</div>
          <div className="text-sm text-yellow-600">
            יש להשלים את כל הדרישות הרגולטוריות לפני סיום הפגישה
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatoryFramework;