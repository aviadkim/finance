import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Save recording info
        const currentDate = new Date().toLocaleDateString('he-IL');
        const newRecordingName = `הקלטה - ${currentDate}`;
        setRecordingName(newRecordingName);
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

  const saveRecording = () => {
    // Here we'll add the save functionality later
    // For now, just show confirmation
    alert('ההקלטה נשמרה בהצלחה');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">הקלטת פגישה</h2>
      
      {/* Recording Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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

        {/* Audio Player */}
        {audioURL && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{recordingName}</h3>
              <button
                onClick={saveRecording}
                className="text-blue-500 hover:text-blue-600"
              >
                שמור הקלטה
              </button>
            </div>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;