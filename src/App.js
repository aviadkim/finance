import React from 'react';
import ClientList from './components/ClientList';
import MeetingRecorder from './components/MeetingRecorder';
import TranscriptManager from './components/TranscriptManager';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            מערכת ניהול פיננסי
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Recording Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">הקלטות פגישות</h2>
              <MeetingRecorder />
            </section>

            {/* Client Base Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">בסיס לקוחות</h2>
              <ClientList />
            </section>

            {/* Transcript Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">תמלולים</h2>
              <TranscriptManager />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;