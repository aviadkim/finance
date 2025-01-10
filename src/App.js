import React from 'react';
import MeetingRecorder from './components/MeetingRecorder';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Financial Advisor Meeting Assistant
          </h1>
          <p className="text-gray-600">
            Record, transcribe, and summarize client meetings
          </p>
        </header>

        <MeetingRecorder />
      </div>
    </div>
  );
}

export default App;