import React, { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { ClientManager } from './components/ClientManager';
import { TranscriptManager } from './components/TranscriptManager';
import { RecordingsList } from './components/RecordingsList';

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
              onClick={() => setActiveTab('recordings')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'recordings' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              הקלטות קודמות
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'recording' && (
          <div className="space-y-6">
            <AudioRecorder onTranscriptReady={() => setShowTranscript(true)} />
            {showTranscript && <TranscriptManager />}
          </div>
        )}
        
        {activeTab === 'clients' && <ClientManager />}
        {activeTab === 'recordings' && <RecordingsList />}
      </main>
    </div>
  );
}

export default App;