import React from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Meeting Recorder
        </h1>
        <AudioRecorder />
      </div>
    </div>
  );
}

export default App;