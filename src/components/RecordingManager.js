import React, { useState, useRef, useEffect } from 'react';

const RecordingManager = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [tempTranscript, setTempTranscript] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorder = useRef(null);
  const recognition = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'he-IL';

      recognition.current.onresult = (event) => {
        const lastResult = Array.from(event.results).pop();
        if (lastResult.isFinal) {
          setTranscript(prev => prev + '\n' + lastResult[0].transcript);
          setTempTranscript('');
        } else {
          setTempTranscript(lastResult[0].transcript);
        }
      };
    }

    return () => {
      stopRecording();
      if (recognition.current) recognition.current.abort();
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      setTranscript('');
      setTempTranscript('');

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      // Start recording
      mediaRecorder.current.start();
      setIsRecording(true);
      startTimer();

      // Start transcription
      if (recognition.current) {
        recognition.current.start();
      }
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

      if (recognition.current) {
        recognition.current.stop();
      }
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">הקלטת פגישה חדשה</h2>
      <div className="space-y-4">
        {/* Client Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">שם לקוח</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border p-2"
            placeholder="הכנס שם לקוח"
          />
        </div>

        {/* Recording Controls */}
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
          <div className="mt-4">
            <h3 className="font-medium mb-2">הקלטה אחרונה</h3>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}

        {/* Transcript */}
        {(transcript || tempTranscript) && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">תמליל שיחה</h3>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {transcript}
              {tempTranscript && (
                <span className="text-gray-500">{tempTranscript}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingManager;