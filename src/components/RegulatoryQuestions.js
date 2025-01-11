import React from 'react';

const RegulatoryQuestions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">שאלות רגולטוריות</h2>
      <div className="space-y-3">
        <div className="flex items-center">
          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
          <label className="mr-2 text-gray-700">האם חל שינוי בצרכי הלקוח?</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
          <label className="mr-2 text-gray-700">האם נדרש עדכון מדיניות השקעה?</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
          <label className="mr-2 text-gray-700">האם קיים ניגוד עניינים?</label>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryQuestions;