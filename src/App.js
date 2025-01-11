import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import ClientPanel from './components/ClientPanel';
import MeetingDetails from './components/MeetingDetails';
import RegulatoryQuestions from './components/RegulatoryQuestions';
import MeetingSummary from './components/MeetingSummary';

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
          <ClientPanel />
          <div className="md:col-span-9 space-y-6">
            <MeetingDetails />
            <AudioRecorder />
            <RegulatoryQuestions />
            <MeetingSummary />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;