import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log('Data chunk received, size:', event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Total chunks:', audioChunksRef.current.length);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('Recording stopped, processing chunks...');
        console.log('Number of chunks:', audioChunksRef.current.length);
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          console.log('Audio blob created, size:', audioBlob.size);
          
          const url = URL.createObjectURL(audioBlob);
          console.log('Audio URL created:', url);
          setAudioURL(url);

          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        } else {
          console.error('No audio chunks recorded');
          setError('No audio data was recorded. Please try again.');
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError(`Recording error: ${event.error}`);
      };

      // Start recording with a timeslice to ensure we get data regularly
      mediaRecorderRef.current.start(1000);
      console.log('Recording started');
      setIsRecording(true);
      setError(null);
      
    } catch (err) {
      console.error('Setup error:', err);
      setError(`Could not start recording: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
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
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500">Recording...</span>
          </div>
        )}

        {audioURL && (
          <div>
            <h3 className="text-lg font-medium mb-2">Recording Playback</h3>
            <audio 
              controls 
              src={audioURL} 
              className="w-full"
              onError={(e) => {
                console.error('Audio playback error:', e);
                setError('Error playing the recording. Please try again.');
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Status: {isRecording ? 'Recording...' : 'Ready'}
        {audioURL && ' | Recording available'}
      </div>
    </div>
  );
};

export default AudioRecorder;