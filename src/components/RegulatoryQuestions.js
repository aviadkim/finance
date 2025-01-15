import React, { useState } from 'react';

const RegulatoryQuestions = ({ categories, onQuestionCheck }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">שאלות רגולטוריות</h2>
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category.id} className="border rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full p-4 text-right bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg">{category.title}</span>
                {category.questions.some(q => q.discussed) && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    נדון
                  </span>
                )}
              </div>
              <span className="transform transition-transform duration-200 text-xl">
                {expandedCategory === category.id ? '−' : '+'}
              </span>
            </button>

            {/* Questions Panel */}
            {expandedCategory === category.id && (
              <div className="p-4 space-y-4 bg-white">
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
                        <div className="flex items-center gap-2">
                          <label className={`${question.discussed ? 'text-green-700' : 'text-gray-700'} font-medium flex-1`}>
                            {question.text}
                          </label>
                          {question.timestamp && (
                            <span className="text-xs text-gray-500 font-mono">
                              {question.timestamp}
                            </span>
                          )}
                        </div>
                        {question.discussed && question.context && (
                          <div className="mt-1 text-sm">
                            <span className="text-green-600 font-medium">ציטוט מהשיחה:</span>
                            <p className="text-gray-600 mt-1 pr-4 border-r-2 border-green-500 line-clamp-2">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegulatoryQuestions;