import React from 'react';
import MeetingRecorder from './components/MeetingRecorder';
import ClientList from './components/ClientList';
import TranscriptManager from './components/TranscriptManager';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            מערכת ניהול פגישות
          </h1>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Recording Section */}
          <section className="col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">הקלטות פגישות</h2>
                <MeetingRecorder />
              </div>
            </div>
          </section>

          {/* Client Management Section */}
          <section className="col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">ניהול לקוחות</h2>
                <ClientList />
              </div>
            </div>
          </section>

          {/* Transcripts Section */}
          <section className="col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">תמלולים</h2>
                <TranscriptManager />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;