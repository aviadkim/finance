import React from 'react';
import SimpleRecorder from './components/SimpleRecorder';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Audio Recorder</h1>
        <SimpleRecorder />
      </div>
    </div>
  );
}

export default App;