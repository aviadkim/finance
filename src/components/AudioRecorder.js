import React, { useState } from 'react';
import AudioRecordingService from '../services/AudioRecordingService';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    const success = await AudioRecordingService.startRecording();
    if (success) {
      setIsRecording(true);
      setAudioUrl(null);
      setTranscript('');
    }
  };

  const stopRecording = async () => {
    const success = await AudioRecordingService.stopRecording();
    if (success) {
      setIsRecording(false);
      const audioBlob = AudioRecordingService.getAudioBlob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Save the recording
      const filename = `recording-${new Date().toISOString()}.wav`;
      await AudioRecordingService.saveRecording(filename);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-md ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          {isRecording && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="ml-2 text-gray-600">Recording...</span>
            </div>
          )}
        </div>

        {audioUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Recording Playback</h3>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        {transcript && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Transcript</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}