import React from 'react';

const MeetingDetails = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">פרטי פגישה</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">תאריך</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">סוג פגישה</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option>עדכון צרכים</option>
            <option>הצגת תיק השקעות</option>
            <option>ייעוץ כללי</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;