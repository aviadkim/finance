import React from 'react';

const RegulatoryQuestions = ({ questions, onQuestionCheck }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">שאלות רגולטוריות</h2>
      <div className="space-y-4">
        {questions.map(question => (
          <div key={question.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={question.checked}
                onChange={() => onQuestionCheck(question.id)}
                className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label className="text-gray-700 font-medium">{question.text}</label>
                {question.discussed && (
                  <div className="mt-1 text-sm">
                    <span className="text-green-600 font-medium">נידון בשיחה:</span>
                    <p className="text-gray-600 mt-1 pr-4 border-r-2 border-green-500">
                      {question.context}
                    </p>
                  </div>
                )}
                {!question.discussed && question.checked && (
                  <div className="mt-1 text-sm text-yellow-600">
                    נבדק ידנית (לא זוהה בתמליל)
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegulatoryQuestions;