import React, { useState } from 'react';
import RecordingManager from './components/RecordingManager';
import RegulatoryFramework from './components/RegulatoryFramework';
import ClientManager from './components/ClientManager';
import TranscriptManager from './components/TranscriptManager';
import SystemStatus from './components/SystemStatus';

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
            <TranscriptManager />
          </div>
        )}
      </main>

      <SystemStatus />
    </div>
  );
}

export default App;