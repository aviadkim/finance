import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [fileName, setFileName] = useState('recording.wav');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [error, setError] = useState(null);

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
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-2 rounded-lg font-medium text-white ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
        </button>

        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="mr-2">מקליט...</span>
          </div>
        )}

        {audioURL && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם הקובץ:
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-3 py-2 border rounded w-full max-w-xs"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">השמעת הקלטה</h3>
              <audio controls src={audioURL} className="w-full mb-4" />
              <button
                onClick={downloadRecording}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                הורד הקלטה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;