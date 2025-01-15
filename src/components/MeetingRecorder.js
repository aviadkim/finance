import React, { useState, useEffect, useCallback } from 'react';
import { AudioRecordingService } from '../services/AudioRecordingService';
import { TranscriptionService } from '../services/TranscriptionService';
import RegulatoryQuestions from './RegulatoryQuestions';
import { initializeQuestions, checkTranscriptForQuestions } from '../utils/regulatoryQuestions';

export default function MeetingRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [regulatoryCategories, setRegulatoryCategories] = useState(initializeQuestions());

  // Live transcript update during recording
  useEffect(() => {
    if (isRecording) {
      const updateInterval = setInterval(() => {
        const currentTranscript = TranscriptionService.getCurrentTranscript();
        if (currentTranscript !== transcript) {
          setTranscript(currentTranscript);
          setRegulatoryCategories(prev => 
            checkTranscriptForQuestions(currentTranscript, prev)
          );
        }
      }, 1000);
      return () => clearInterval(updateInterval);
    }
  }, [isRecording, transcript]);

  const startRecording = async () => {
    setError('');
    const success = await AudioRecordingService.startRecording();
    if (success) {
      setIsRecording(true);
      setAudioUrl(null);
      // Don't reset transcript or questions here
    } else {
      setError('לא ניתן להתחיל הקלטה. אנא ודא שיש גישה למיקרופון.');
    }
  };

  const stopRecording = async () => {
    try {
      const { audioBlob, audioUrl } = await AudioRecordingService.stopRecording();
      setIsRecording(false);
      setAudioUrl(audioUrl);
      await processAudioData(audioBlob);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      setError('אירעה שגיאה בעצירת ההקלטה');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      await processAudioData(file);
    }
  };

  const processAudioData = async (audioData) => {
    setIsProcessing(true);
    setError('');
    try {
      const result = await TranscriptionService.transcribe(audioData);
      setTranscript(result.text);
      setRegulatoryCategories(prev => 
        checkTranscriptForQuestions(result.text, prev)
      );
    } catch (error) {
      console.error('Error processing audio:', error);
      setError('אירעה שגיאה בעיבוד ההקלטה');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuestionCheck = useCallback((categoryId, questionId) => {
    setRegulatoryCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              questions: category.questions.map(question =>
                question.id === questionId
                  ? { ...question, checked: !question.checked }
                  : question
              )
            }
          : category
      )
    );
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Recording Controls */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-3 rounded-md text-white font-semibold flex items-center gap-2 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={isProcessing}
            >
              {isRecording ? (
                <>
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                  הפסק הקלטה
                </>
              ) : (
                'התחל הקלטה'
              )}
            </button>

            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
                disabled={isProcessing}
              />
              <label
                htmlFor="audio-upload"
                className={`px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md cursor-pointer font-semibold flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                העלאת קובץ שמע
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              מעבד את ההקלטה...
            </div>
          )}

          {/* Audio Playback */}
          {audioUrl && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">השמעת הקלטה</h3>
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}

          {/* Live Transcript */}
          {(transcript || isRecording) && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">תמליל</h3>
              <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap text-gray-700 leading-relaxed">
                {transcript || 'מאזין...'}
              </div>
            </div>
          )}
        </div>

        {/* Regulatory Questions Panel */}
        <div className="h-full">
          <RegulatoryQuestions 
            categories={regulatoryCategories}
            onQuestionCheck={handleQuestionCheck}
          />
        </div>
      </div>
    </div>
  );
}