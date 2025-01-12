import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('recording');

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold">מערכת ניהול פגישות</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('recording')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'recording' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              הקלטת פגישה
            </button>
            <button 
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'clients' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              ניהול לקוחות
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'recording' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">הקלטת פגישה חדשה</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">שם לקוח</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="הכנס שם לקוח"
                />
              </div>
              <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                התחל הקלטה
              </button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">ניהול לקוחות</h2>
            <div className="text-center text-gray-500">
              רשימת הלקוחות תופיע כאן
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;