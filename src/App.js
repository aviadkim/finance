import React, { useState } from 'react';
import RecordingManager from './components/RecordingManager';
import RegulatoryFramework from './components/RegulatoryFramework';
import ClientManager from './components/ClientManager';

function App() {
  const [activeTab, setActiveTab] = useState('recording');
  const [transcriptData, setTranscriptData] = useState(null);

  const handleTranscriptUpdate = (data) => {
    setTranscriptData(data);
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecordingManager onTranscriptUpdate={handleTranscriptUpdate} />
            <RegulatoryFramework transcriptData={transcriptData} />
          </div>
        )}

        {activeTab === 'clients' && (
          <ClientManager />
        )}
        
        {activeTab === 'transcripts' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">תמלילים</h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="חיפוש לפי שם לקוח או תאריך..."
                  className="w-full p-3 border rounded-lg pr-10"
                />
                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">ישראל ישראלי</div>
                      <div className="text-sm text-gray-600">
                        15/01/2024 • 14:30
                        <br />
                        משך שיחה: 45:20
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                        הורד
                      </button>
                      <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                        שלח במייל
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">שרה כהן</div>
                      <div className="text-sm text-gray-600">
                        14/01/2024 • 10:15
                        <br />
                        משך שיחה: 32:10
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                        הורד
                      </button>
                      <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                        שלח במייל
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
