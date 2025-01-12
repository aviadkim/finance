import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('recording');

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Header Navigation */}
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">מערכת ניהול פגישות</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('recording')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'recording' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              הקלטת פגישה
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'clients' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              ניהול לקוחות
            </button>
            <button
              onClick={() => setActiveTab('transcripts')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'transcripts' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              תמלילים
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'recording' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">הקלטת פגישה חדשה</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">שם לקוח</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    placeholder="הכנס שם לקוח"
                  />
                </div>
                <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                  התחל הקלטה
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">ניהול לקוחות</h2>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                הוסף לקוח חדש +
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((client) => (
                <div key={client} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="font-medium">לקוח {client}</div>
                  <div className="text-sm text-gray-500">פגישה אחרונה: 15/01/2024</div>
                  <button className="mt-2 text-blue-500 hover:underline">צפה בהיסטוריה</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transcripts' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">תמלילי פגישות</h2>
            <div className="space-y-4">
              {[1, 2].map((transcript) => (
                <div key={transcript} className="border rounded-lg p-4">
                  <div className="font-medium">תמליל {transcript}</div>
                  <div className="text-sm text-gray-500">תאריך: 15/01/2024</div>
                  <div className="mt-2 flex gap-2">
                    <button className="text-blue-500 hover:underline">צפה בתמליל</button>
                    <button className="text-green-500 hover:underline">שלח במייל</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;