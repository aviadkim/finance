import React, { useState, useEffect, useCallback } from 'react';
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

  // Start live transcription immediately
  useEffect(() => {
    if (isRecording) {
      TranscriptionService.startLiveTranscription(text => {
        setCurrentTranscript(text);
        // Check questions in real-time
        setRegulatoryCategories(prev => 
          checkTranscriptForQuestions(text, prev)
        );
      });

      return () => TranscriptionService.stopLiveTranscription();
    }
  }, [isRecording]);

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
    } else {
      setError('לא ניתן להתחיל הקלטה. אנא ודא שיש גישה למיקרופון.');
    }
  };

  const stopRecording = async () => {
    try {
      await AudioRecordingService.stopRecording();
      setIsRecording(false);
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
        <div className="mb-4">
          <button
            onClick={toggleRecording}
            className={`px-6 py-3 rounded-md text-white font-semibold flex items-center gap-2 w-full justify-center ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
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