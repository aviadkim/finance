import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('recording');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
    } catch (err) {
      console.error('Error:', err);
      alert('לא ניתן להתחיל הקלטה');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold">מערכת ניהול פגישות</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('recording')}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white"
            >
              הקלטת פגישה
            </button>
            <button 
              onClick={() => setActiveTab('clients')}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              ניהול לקוחות
            </button>
            <button 
              onClick={() => setActiveTab('transcripts')}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              תמלילים
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'recording' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">הקלטת פגישה חדשה</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">שם לקוח</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border p-2"
                  placeholder="הכנס שם לקוח"
                />
              </div>
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full p-3 rounded-lg text-white ${
                  isRecording ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
              </button>
            </div>
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