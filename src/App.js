import React from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 text-right">
            מערכת הקלטות פגישות
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <AudioRecorder />
        </div>
      </main>
    </div>
  );
}

export default App;