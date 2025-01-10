import React, { useState, useEffect, useRef } from 'react';
import { generateEmailTemplate } from '../utils/emailUtils';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [email, setEmail] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      console.log('Starting recording process...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
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

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Could not start recording: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processTranscript = async (audioBlob) => {
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'he-IL'; // Set Hebrew as the language
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const fullTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        setTranscript(fullTranscript);
        generateEmail(fullTranscript);
      };

      recognition.start();
    } catch (err) {
      console.error('Error processing transcript:', err);
      setError(`Could not process transcript: ${err.message}`);
    }
  };

  const generateEmail = (transcriptText) => {
    try {
      const emailContent = generateEmailTemplate({
        transcript: transcriptText,
        date: new Date().toLocaleDateString('he-IL'),
        advisorName: 'יועץ פיננסי',
        clientName: 'לקוח יקר'
      });

      setEmail(emailContent);
    } catch (err) {
      console.error('Error generating email:', err);
      setError(`Could not generate email: ${err.message}`);
    }
  };

  const sendEmail = () => {
    if (email) {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow" dir="rtl">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white font-medium`}
          >
            {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
          </button>
          
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500">מקליט...</span>
            </div>
          )}
        </div>

        {audioURL && (
          <div>
            <h3 className="text-lg font-semibold mb-2">הקלטה</h3>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}

        {transcript && (
          <div>
            <h3 className="text-lg font-semibold mb-2">תמליל</h3>
            <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}

        {email && (
          <div>
            <h3 className="text-lg font-semibold mb-2">אימייל סיכום</h3>
            <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap">
              <div className="font-bold mb-2">{email.subject}</div>
              <div>{email.body}</div>
            </div>
            <button
              onClick={sendEmail}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              שלח אימייל
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;