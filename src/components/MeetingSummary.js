import React from 'react';

const MeetingSummary = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">סיכום פגישה</h2>
      <textarea
        className="w-full h-32 p-2 border rounded"
        placeholder="הזן סיכום פגישה..."
      />
      <div className="mt-4 flex justify-end space-x-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          שמור והמשך
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          שלח ללקוח
        </button>
      </div>
    </div>
  );
};

export default MeetingSummary;