import React, { useState, useEffect } from 'react';
import { AudioRecordingService } from '../services/AudioRecordingService';
import { TranscriptionService } from '../services/TranscriptionService';
import { MeetingTemplates } from '../utils/MeetingTemplates';

export default function MeetingRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [emailPreview, setEmailPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const startRecording = async () => {
    const success = await AudioRecordingService.startRecording();
    if (success) {
      setIsRecording(true);
      setAudioUrl(null);
      setTranscript('');
      setSummary('');
    }
  };

  const stopRecording = async () => {
    const success = await AudioRecordingService.stopRecording();
    if (success) {
      setIsRecording(false);
      const audioBlob = AudioRecordingService.getAudioBlob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      processAudioData(audioBlob);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      await processAudioData(file);
    }
  };

  const processAudioData = async (audioData) => {
    try {
      const transcriptResult = await TranscriptionService.transcribe(audioData);
      setTranscript(transcriptResult.text);
      
      const summaryResult = await TranscriptionService.summarize(transcriptResult.text);
      setSummary(summaryResult);

      const emailTemplate = MeetingTemplates.generateEmailTemplate({
        transcript: transcriptResult.text,
        summary: summaryResult,
        template: selectedTemplate
      });
      
      setEmailPreview(emailTemplate);
    } catch (error) {
      console.error('Error processing audio:', error);
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
            {isRecording ? 'Stop Recording' : 'Start Recording'}
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
              Upload Audio
            </label>
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 font-medium">Recording...</span>
          </div>
        )}

        {/* Audio Playback */}
        {audioUrl && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Audio Playback</h3>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Transcript</h3>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Summary</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              {summary}
            </div>
          </div>
        )}

        {/* Email Preview */}
        {emailPreview && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Email Preview</h3>
            <div className="p-4 border border-gray-200 rounded-md">
              <div className="font-semibold mb-2">{emailPreview.subject}</div>
              <div className="whitespace-pre-wrap">{emailPreview.body}</div>
            </div>
            <button
              onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(emailPreview.subject)}&body=${encodeURIComponent(emailPreview.body)}`}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Send Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
