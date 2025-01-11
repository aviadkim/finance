import React from 'react';

const ClientPanel = () => {
  return (
    <div className="md:col-span-3 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">בחירת לקוח</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">חיפוש לקוח</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="הקלד שם לקוח..."
          />
        </div>
        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          לקוח חדש +
        </button>
      </div>
    </div>
  );
};

export default ClientPanel;