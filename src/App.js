import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';

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
              className={`px-4 py-2 rounded-lg ${activeTab === 'recording' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              הקלטת פגישה
            </button>
            <button 
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'clients' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              ניהול לקוחות
            </button>
            <button 
              onClick={() => setActiveTab('transcripts')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'transcripts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              תמלילים
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'recording' && (
          <div>
            <div className="mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם לקוח</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="הכנס שם לקוח"
                />
              </div>
            </div>
            <AudioRecorder />
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">ניהול לקוחות</h2>
            <div>בקרוב...</div>
          </div>
        )}

        {activeTab === 'transcripts' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">תמלילים</h2>
            <div>בקרוב...</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;