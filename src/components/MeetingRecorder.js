import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AudioRecordingService } from '../services/AudioRecordingService';
import { TranscriptionService } from '../services/TranscriptionService';
import RegulatoryQuestions from './RegulatoryQuestions';
import { initializeQuestions, checkTranscriptForQuestions } from '../utils/regulatoryQuestions';

export default function MeetingRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [regulatoryCategories, setRegulatoryCategories] = useState(initializeQuestions());
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const recordingStartTime = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      recordingStartTime.current = Date.now();
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - recordingStartTime.current) / 1000));
      }, 1000);

      TranscriptionService.startLiveTranscription(text => {
        setCurrentTranscript(text);
        const currentTime = Math.floor((Date.now() - recordingStartTime.current) / 1000);
        const timestamp = new Date(recordingStartTime.current + currentTime * 1000).toLocaleTimeString();
        setRegulatoryCategories(prev => 
          checkTranscriptForQuestions(text, prev, timestamp)
        );
      });

      return () => {
        clearInterval(timerRef.current);
        TranscriptionService.stopLiveTranscription();
      };
    }
  }, [isRecording]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    setError('');
    const success = await AudioRecordingService.startRecording();
    if (success) {
      setIsRecording(true);
      setRecordingTime(0);
    } else {
      setError('לא ניתן להתחיל הקלטה. אנא ודא שיש גישה למיקרופון.');
    }
  };

  const stopRecording = async () => {
    try {
      const { audioBlob, url } = await AudioRecordingService.stopRecording();
      setIsRecording(false);
      setAudioUrl(url);
      clearInterval(timerRef.current);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      setError('אירעה שגיאה בעצירת ההקלטה');
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
    <div className="h-full flex">
      {/* Left Panel - Transcript and Recording */}
      <div className="w-1/2 p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={toggleRecording}
            className={`px-6 py-3 rounded-md text-white font-semibold flex items-center gap-2 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
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
          <div className="text-lg font-mono">{formatTime(recordingTime)}</div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto">
          {isRecording && !currentTranscript && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              מאזין...
            </div>
          )}
          {currentTranscript && (
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {currentTranscript}
            </div>
          )}
        </div>

        {audioUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">הקלטה</h3>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
      </div>

      {/* Right Panel - Regulatory Questions */}
      <div className="w-1/2 p-4 bg-gray-50 overflow-auto">
        <RegulatoryQuestions 
          categories={regulatoryCategories}
          onQuestionCheck={handleQuestionCheck}
        />
      </div>
    </div>
  );
}