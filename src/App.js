import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('recording');
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white shadow-lg p-4">
        <div className="flex justify-between max-w-7xl mx-auto">
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
            <button 
              onClick={() => setActiveTab('transcripts')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'transcripts' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              תמלילים
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'recording' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">הקלטת פגישה חדשה</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">שם לקוח</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3].map((client) => (
                <div key={client} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="font-medium">לקוח {client}</div>
                  <div className="text-sm text-gray-500">פגישה אחרונה: 15/01/2024</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transcripts' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">תמלילי פגישות</h2>
            <div className="space-y-4">
              {[1,2].map((transcript) => (
                <div key={transcript} className="p-4 border rounded-lg">
                  <div className="font-medium">תמליל {transcript}</div>
                  <div className="text-sm text-gray-500">תאריך: 15/01/2024</div>
                  <div className="mt-2">
                    <button className="text-blue-500 hover:underline">
                      צפה בתמליל
                    </button>
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