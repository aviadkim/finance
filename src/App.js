import React from 'react';
import { useState, useRef } from 'react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      alert('Could not start recording: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          מערכת הקלטת שיחות
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
          </button>

          {isRecording && (
            <div className="mt-4 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse ml-2" />
              <span>מקליט...</span>
            </div>
          )}

          {audioURL && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">הקלטה</h3>
              <audio controls src={audioURL} className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;