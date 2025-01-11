import React from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Meeting Recorder
        </h1>
        <AudioRecorder />
      </div>
    </div>
  );
}

export default App;