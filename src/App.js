import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [activeTab, setActiveTab] = useState('recording');
  const recorder = AudioRecorder();

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold">מערכת ניהול פגישות</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('recording')}
              className={\`px-4 py-2 rounded-lg \${activeTab === 'recording' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
            >
              הקלטת פגישה
            </button>
            <button 
              onClick={() => setActiveTab('clients')}
              className={\`px-4 py-2 rounded-lg \${activeTab === 'clients' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
            >
              ניהול לקוחות
            </button>
            <button 
              onClick={() => setActiveTab('transcripts')}
              className={\`px-4 py-2 rounded-lg \${activeTab === 'transcripts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
            >
              תמלילים
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'recording' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">הקלטת פגישה חדשה</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם לקוח</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="הכנס שם לקוח"
                />
              </div>
              <div className="flex items-center justify-between">
                <button 
                  onClick={recorder.isRecording ? recorder.stopRecording : recorder.startRecording}
                  className={\`px-6 py-2 rounded-lg \${
                    recorder.isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white flex items-center gap-2\`}
                >
                  {recorder.isRecording && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                  {recorder.isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
                </button>
                {recorder.isRecording && (
                  <div className="text-gray-600">{recorder.recordingTime}</div>
                )}
              </div>
            </div>
            {recorder.audioUrl && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">הקלטה אחרונה</h3>
                <audio controls src={recorder.audioUrl} className="w-full" />
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">ניהול לקוחות</h2>
            <div className="text-lg">בקרוב...</div>
          </div>
        )}

        {activeTab === 'transcripts' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">תמלילים</h2>
            <div className="text-lg">בקרוב...</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;