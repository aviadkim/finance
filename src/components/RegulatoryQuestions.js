import React, { useState } from 'react';

const QuestionSection = ({ section, expanded, onToggle, onQuestionCheck }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm transition-all duration-200 h-full flex flex-col">
      {/* Section Header - Always Visible */}
      <button
        onClick={onToggle}
        className={`p-4 text-center w-full transition-colors duration-200 flex-none 
          ${expanded ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}
      >
        <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{section.description}</p>
      </button>

      {/* Questions Panel - Expandable */}
      {expanded && (
        <div className="p-4 space-y-4 border-t flex-1 overflow-auto">
          {section.questions.map(question => (
            <div key={question.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={question.checked}
                  onChange={() => onQuestionCheck(section.id, question.id)}
                  className="mt-1.5 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label className={`${question.discussed ? 'text-green-700' : 'text-gray-700'} font-medium flex-1`}>
                      {question.text}
                    </label>
                    {question.timestamp && (
                      <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                        {question.timestamp}
                      </span>
                    )}
                  </div>

                  {question.discussed && question.context && (
                    <div className="mt-2 text-sm bg-green-50 p-3 rounded-lg">
                      <div className="text-green-600 font-medium mb-1">ציטוט מהשיחה:</div>
                      <p className="text-gray-600 pr-3 border-r-2 border-green-500">
                        {question.context}
                      </p>
                    </div>
                  )}

                  {!question.discussed && question.checked && (
                    <div className="mt-1 text-sm text-yellow-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
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
  );
};

const RegulatoryQuestions = ({ categories, onQuestionCheck }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4">שאלות רגולטוריות</h2>
      
      {/* Sections Grid */}
      <div className="grid grid-cols-3 gap-4 flex-1">
        {categories.map(category => (
          <QuestionSection
            key={category.id}
            section={category}
            expanded={expandedSection === category.id}
            onToggle={() => setExpandedSection(expandedSection === category.id ? null : category.id)}
            onQuestionCheck={onQuestionCheck}
          />
        ))}
      </div>
    </div>
  );
};

export default RegulatoryQuestions;