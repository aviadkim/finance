import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [meetings, setMeetings] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            מערכת ניהול פגישות
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Client Selection Panel */}
          <div className="md:col-span-3 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">בחירת לקוח</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">חיפוש לקוח</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="הקלד שם לקוח..."
                />
              </div>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                לקוח חדש +
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9 space-y-6">
            {/* Meeting Info */}
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

            {/* Recording Section */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">הקלטת הפגישה</h2>
              <AudioRecorder />
            </div>

            {/* Regulatory Questions */}
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

            {/* Summary Section */}
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;