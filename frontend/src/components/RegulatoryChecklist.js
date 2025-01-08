import React, { useState, useEffect } from 'react';

function RegulatoryChecklist() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('/config/questions.json')
      .then(res => res.json())
      .then(data => setQuestions(data.regulatoryQuestions));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">שאלות רגולטוריות</h2>
      
      {questions.map((q) => (
        <div key={q.id} className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">{q.question}</h3>
          {q.subQuestions?.map((subQ, i) => (
            <div key={i} className="mt-2 mr-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>{subQ}</span>
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}