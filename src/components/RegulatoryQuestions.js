import React from 'react';

const RegulatoryQuestions = ({ categories, onQuestionCheck }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">שאלות רגולטוריות</h2>
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category.id} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">{category.title}</h3>
            <div className="space-y-4">
              {category.questions.map(question => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={question.checked}
                      onChange={() => onQuestionCheck(category.id, question.id)}
                      className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label className={`${question.discussed ? 'text-green-700' : 'text-gray-700'} font-medium`}>
                        {question.text}
                      </label>
                      {question.discussed && question.context && (
                        <div className="mt-1 text-sm">
                          <span className="text-green-600 font-medium">נידון בשיחה:</span>
                          <p className="text-gray-600 mt-1 pr-4 border-r-2 border-green-500">
                            {question.context}
                          </p>
                        </div>
                      )}
                      {!question.discussed && question.checked && (
                        <div className="mt-1 text-sm text-yellow-600">
                          נבדק ידנית
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegulatoryQuestions;