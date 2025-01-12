import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);
  const recognition = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'he-IL';

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        setTranscript(prev => prev + ' ' + transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
      };
    }

    return () => {
      stopRecording();
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (recognition.current) recognition.current.abort();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      setTranscript('');

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

      // Start transcription
      if (recognition.current) {
        recognition.current.start();
        setIsTranscribing(true);
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
        setIsTranscribing(false);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setTranscript('');
      
      // Create an Audio element to play the file
      const audio = new Audio(url);
      
      // Start transcription when audio starts playing
      audio.addEventListener('play', () => {
        if (recognition.current) {
          recognition.current.start();
          setIsTranscribing(true);
        }
      });

      // Stop transcription when audio ends
      audio.addEventListener('ended', () => {
        if (recognition.current) {
          recognition.current.stop();
          setIsTranscribing(false);
        }
      });

    } catch (err) {
      console.error('Error uploading file:', err);
      alert('שגיאה בטעינת הקובץ');
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">הקלטת פגישה</h2>
      
      {/* Recording Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={!!uploadedFile}
          >
            {isRecording && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
            {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
          </button>
          
          {/* File Upload */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              disabled={isRecording}
            >
              העלה הקלטה
            </button>
          </div>
          
          {isRecording && (
            <div className="text-gray-600 font-medium">
              {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {/* Audio Player */}
        {audioURL && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">
              {uploadedFile ? `הקלטה: ${uploadedFile.name}` : 'הקלטה אחרונה'}
            </h3>
            <audio 
              controls 
              src={audioURL} 
              className="w-full"
              onPlay={() => {
                if (uploadedFile && recognition.current) {
                  recognition.current.start();
                  setIsTranscribing(true);
                }
              }}
              onEnded={() => {
                if (uploadedFile && recognition.current) {
                  recognition.current.stop();
                  setIsTranscribing(false);
                }
              }}
            />
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">תמליל</h3>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}

        {isTranscribing && (
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            מתמלל...
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;