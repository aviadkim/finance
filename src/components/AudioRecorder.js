import React, { useState, useEffect, useRef } from 'react';
import { setupHebrewRecognition } from '../utils/hebrewSupport';
import { generateEmail } from '../utils/emailTemplates';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [emailContent, setEmailContent] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        await processTranscript(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processTranscript = async (audioBlob) => {
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      setupHebrewRecognition(recognition);
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        setTranscript(transcript);
        generateEmailContent(transcript);
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
      };

      recognition.start();
    } catch (err) {
      setError(`Transcript processing error: ${err.message}`);
    }
  };

  const generateEmailContent = (transcript) => {
    try {
      const emailData = {
        date: new Date().toLocaleDateString('he-IL'),
        clientName: 'לקוח',
        summary: transcript.substring(0, 200) + '...',
        actionItems: 'פעולות להמשך יוגדרו',
        nextSteps: 'פגישת המשך תתואם',
        advisorName: 'יועץ'
      };

      const email = generateEmail('meetingSummary', 'he', emailData);
      setEmailContent(email);
    } catch (err) {
      setError(`Email generation error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg" dir="rtl">
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
          {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
        </button>

        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500">מקליט...</span>
          </div>
        )}

        {audioURL && (
          <div>
            <h3 className="text-lg font-medium mb-2">הקלטה</h3>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}

        {transcript && (
          <div>
            <h3 className="text-lg font-medium mb-2">תמליל</h3>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}

        {emailContent && (
          <div>
            <h3 className="text-lg font-medium mb-2">טיוטת אימייל</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2">{emailContent.subject}</div>
              <div className="whitespace-pre-wrap">{emailContent.body}</div>
              <button
                onClick={() => {
                  window.location.href = `mailto:?subject=${encodeURIComponent(
                    emailContent.subject
                  )}&body=${encodeURIComponent(emailContent.body)}`;
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                שלח אימייל
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;