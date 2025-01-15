import React, { useState } from 'react';
import audioRecordingService from '../services/AudioRecordingService';

export default function MeetingRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const startRecording = async () => {
    const success = await audioRecordingService.startRecording();
    if (success) {
      setIsRecording(true);
      setAudioUrl(null);
      setTranscript('');
    }
  };

  const stopRecording = async () => {
    try {
      const { audioBlob, audioUrl } = await audioRecordingService.stopRecording();
      setIsRecording(false);
      setAudioUrl(audioUrl);
      // You can process the audioBlob here if needed
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col space-y-6">
        {/* Recording Controls */}
        <div className="flex space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-md text-white font-semibold ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
          </button>

          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md cursor-pointer font-semibold"
            >
              העלאת קובץ שמע
            </label>
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 font-medium">מקליט...</span>
          </div>
        )}

        {/* Audio Playback */}
        {audioUrl && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">השמעת הקלטה</h3>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}