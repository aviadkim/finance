import React, { useState, useEffect, useRef } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup function
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      console.log('Starting recording process...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk recorded:', event.data.size, 'bytes');
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log('Recording stopped, processing audio...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        await processTranscript(audioBlob);
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Could not start recording: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...');
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processTranscript = async (audioBlob) => {
    try {
      // For testing, we'll use a mock transcript
      console.log('Processing transcript...');
      const mockTranscript = 'This is a test transcript. The actual speech-to-text will be implemented here.';
      setTranscript(mockTranscript);
      
      // In the future, we'll implement actual speech recognition here
      // const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      // recognition.continuous = true;
      // recognition.interimResults = false;
      // recognition.onresult = (event) => {...};
    } catch (err) {
      console.error('Error processing transcript:', err);
      setError(`Could not process transcript: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white font-medium`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500">Recording in progress...</span>
            </div>
          )}
        </div>

        {audioURL && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Recording Playback</h3>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}

        {transcript && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Transcript</h3>
            <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;