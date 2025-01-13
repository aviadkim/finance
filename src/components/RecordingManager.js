import React, { useState, useRef, useEffect } from 'react';

const RecordingManager = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [tempTranscript, setTempTranscript] = useState('');
  const [summary, setSummary] = useState(null);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'he-IL';

      recognition.current.onresult = (event) => {
        const lastResult = Array.from(event.results).pop();
        if (lastResult.isFinal) {
          const transcriptEntry = {
            speaker: transcript.length % 2 === 0 ? 'advisor' : 'client',
            text: lastResult[0].transcript,
            timestamp: new Date().toISOString()
          };
          setTranscript(prev => [...prev, transcriptEntry]);
          setTempTranscript('');
        } else {
          setTempTranscript(lastResult[0].transcript);
        }
      };
    }

    return () => cleanup();
  }, []);

  const cleanup = () => {
    stopRecording();
    if (timerInterval.current) clearInterval(timerInterval.current);
    if (recognition.current) recognition.current.abort();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      setTranscript([]);
      setTempTranscript('');
      setSummary(null);

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

      mediaRecorder.current.start();
      setIsRecording(true);
      startTimer();
      recognition.current?.start();
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
      recognition.current?.stop();
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
      {/* Recording Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">הקלטת פגישה</h2>
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
          <audio controls src={audioURL} className="w-full mb-4" />
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">תמליל שיחה</h4>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              {transcript.map((entry, index) => (
                <div key={index} className={`mb-2 ${
                  entry.speaker === 'advisor' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  <strong>{entry.speaker === 'advisor' ? 'יועץ:' : 'לקוח:'}</strong> {entry.text}
                </div>
              ))}
              {tempTranscript && (
                <div className="text-gray-500 italic">{tempTranscript}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      {summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">סיכום שיחה</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {summary}
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => {
                alert('פונקציונליות שליחת מייל תתווסף בקרוב');
              }}
            >
              שלח במייל
            </button>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={() => {
                alert('פונקציונליות שמירה בתיק לקוח תתווסף בקרוב');
              }}
            >
              שמור בתיק לקוח
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingManager;