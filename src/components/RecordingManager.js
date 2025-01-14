import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const RecordingManager = ({ onTranscriptUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const mediaRecorderRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  useEffect(() => {
    // Setup Web Speech API
    if ('webkitSpeechRecognition' in window) {
      speechRecognitionRef.current = new window.webkitSpeechRecognition();
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = 'he-IL';

      speechRecognitionRef.current.onresult = (event) => {
        const newTranscript = [...transcript];
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            newTranscript.push({
              text: event.results[i][0].transcript,
              speaker: 'דובר', // Will be enhanced with speaker identification
              timestamp: new Date().toISOString()
            });
          }
        }
        setTranscript(newTranscript);
        onTranscriptUpdate?.(newTranscript);
      };
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, [transcript, onTranscriptUpdate]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          // Save audio data to Firebase Storage (will be implemented)
          console.log('Audio data available');
        }
      };

      mediaRecorderRef.current.start();
      speechRecognitionRef.current?.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      mediaRecorderRef.current?.stop();
      speechRecognitionRef.current?.stop();
      setIsRecording(false);

      // Save transcript to Firestore
      await addDoc(collection(db, 'transcripts'), {
        transcript,
        timestamp: new Date().toISOString(),
        duration: 0, // Will be calculated
        status: 'completed'
      });

    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">מערכת הקלטה ותמלול</h2>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-lg ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
        </button>
      </div>

      {/* Live Transcript Display */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg h-96 overflow-y-auto">
        {transcript.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            התמליל יופיע כאן במהלך ההקלטה
          </div>
        ) : (
          <div className="space-y-2">
            {transcript.map((entry, index) => (
              <div key={index} className="p-2 bg-white rounded shadow-sm">
                <span className="font-bold">{entry.speaker}:</span>{' '}
                <span>{entry.text}</span>
                <div className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString('he-IL')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingManager;