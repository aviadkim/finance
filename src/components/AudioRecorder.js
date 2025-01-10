import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    setupRecording();
  }, []);

  const setupRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        generateTranscript(audioBlob);
      };

      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const startRecording = () => {
    if (mediaRecorder) {
      setAudioChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
      console.log('Recording started');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  const generateTranscript = async (audioBlob) => {
    // Here we'll use browser's speech recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setTranscript(transcript);
      console.log('Transcript generated:', transcript);
    };
    
    recognition.start();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg font-semibold text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          {isRecording && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="ml-2 text-red-500">Recording...</span>
            </div>
          )}
        </div>

        {audioURL && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recording Playback</h3>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}

        {transcript && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Transcript</h3>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;