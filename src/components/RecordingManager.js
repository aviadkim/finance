import React, { useState, useRef, useEffect } from 'react';
import TranscriptionService from '../services/TranscriptionService';

const RecordingManager = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);

  useEffect(() => {
    TranscriptionService.initialize();
    return () => cleanup();
  }, []);

  const cleanup = () => {
    stopRecording();
    if (timerInterval.current) clearInterval(timerInterval.current);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      setTranscript('');
      setSummary('');

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Generate summary after recording
        const meetingSummary = TranscriptionService.generateSummary();
        setSummary(meetingSummary);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error('Error starting recording:', err);
      alert('לא ניתן להתחיל הקלטה. אנא ודא שיש גישה למיקרופון');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      stopTimer();
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Recording Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">הקלטת פגישה</h2>
        
        {/* Recording Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isRecording && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
            {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
          </button>
          
          {isRecording && (
            <div className="text-gray-600 font-medium">
              {formatTime(recordingTime)}
            </div>
          )}
        </div>
      </div>

      {/* Audio Player & Transcript */}
      {audioURL && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">תוצאות הקלטה</h3>
          
          {/* Audio Player */}
          <div className="mb-6">
            <audio controls src={audioURL} className="w-full" />
          </div>
          
          {/* Transcript */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">תמליל שיחה</h4>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              {TranscriptionService.transcript.map((entry, index) => (
                <div key={index} className={`mb-2 ${
                  entry.speaker === 'advisor' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  <strong>{entry.speaker === 'advisor' ? 'יועץ:' : 'לקוח:'}</strong> {entry.text}
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary */}
          {summary && (
            <div>
              <h4 className="font-medium mb-2">סיכום שיחה</h4>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {summary}
              </div>
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => {
                  // Here we'll add email functionality
                  alert('סיכום השיחה נשלח במייל');
                }}
              >
                שלח סיכום במייל
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordingManager;