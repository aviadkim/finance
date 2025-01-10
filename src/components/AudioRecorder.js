import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Component mounted - checking microphone access...');
    setupRecording().catch(err => {
      console.error('Setup failed:', err);
      setError(err.message);
    });
  }, []);

  const setupRecording = async () => {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      
      const recorder = new MediaRecorder(stream);
      console.log('MediaRecorder created successfully');
      
      recorder.ondataavailable = (event) => {
        console.log('Data chunk available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          setAudioChunks((chunks) => {
            console.log('Adding chunk to audioChunks');
            return [...chunks, event.data];
          });
        }
      };

      recorder.onstop = () => {
        console.log('Recording stopped, processing audio...');
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log('Audio blob created:', audioBlob.size, 'bytes');
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        console.log('Audio URL created:', audioUrl);
        generateTranscript(audioBlob);
      };

      setMediaRecorder(recorder);
      console.log('Setup completed successfully');
    } catch (error) {
      console.error('Setup recording error:', error);
      setError(`Error setting up recording: ${error.message}`);
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      if (mediaRecorder) {
        setAudioChunks([]);
        mediaRecorder.start();
        setIsRecording(true);
        console.log('Recording started successfully');
      } else {
        console.error('MediaRecorder not initialized');
        setError('Recording setup not ready. Please refresh and try again.');
      }
    } catch (error) {
      console.error('Start recording error:', error);
      setError(`Error starting recording: ${error.message}`);
    }
  };

  const stopRecording = () => {
    try {
      console.log('Stopping recording...');
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        setIsRecording(false);
        console.log('Recording stopped successfully');
      } else {
        console.error('Invalid state - recorder:', mediaRecorder, 'isRecording:', isRecording);
      }
    } catch (error) {
      console.error('Stop recording error:', error);
      setError(`Error stopping recording: ${error.message}`);
    }
  };

  const generateTranscript = async (audioBlob) => {
    try {
      console.log('Starting transcript generation...');
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      console.log('Speech recognition initialized');
      
      recognition.lang = 'he-IL'; // Support for Hebrew
      recognition.continuous = true;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        console.log('Speech recognition result received');
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        console.log('Generated transcript:', transcript);
        setTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Transcription error: ${event.error}`);
      };
      
      recognition.start();
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Transcript generation error:', error);
      setError(`Error generating transcript: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

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

        <div className="text-sm text-gray-500">
          Status: {isRecording ? 'Recording...' : 'Ready'}
          {mediaRecorder && ' | Recorder initialized'}
          {audioURL && ' | Audio processed'}
          {transcript && ' | Transcript generated'}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;