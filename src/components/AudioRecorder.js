import React, { useState, useEffect, useRef } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  // Initialize speech recognition with Hebrew support
  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      setError('הדפדפן שלך לא תומך בזיהוי דיבור');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'he-IL'; // Set language to Hebrew
    recognition.continuous = true;
    recognition.interimResults = true;
    return recognition;
  };

  const startRecording = async () => {
    try {
      console.log('מתחיל הקלטה...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('נשמר קטע אודיו:', event.data.size, 'bytes');
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log('ההקלטה הסתיימה, מעבד את האודיו...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Start speech recognition
        const recognition = initSpeechRecognition();
        if (recognition) {
          recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map(result => result[0].transcript)
              .join(' ');
            console.log('תמליל זוהה:', transcript);
            setTranscript(transcript);
          };

          recognition.onerror = (event) => {
            console.error('שגיאת זיהוי דיבור:', event.error);
            setError(`שגיאה בזיהוי דיבור: ${event.error}`);
          };

          try {
            recognition.start();
          } catch (err) {
            console.error('שגיאה בהפעלת זיהוי דיבור:', err);
            setError('שגיאה בהפעלת זיהוי דיבור');
          }
        }
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      console.log('ההקלטה התחילה בהצלחה');
    } catch (err) {
      console.error('שגיאה בהתחלת ההקלטה:', err);
      setError(`לא ניתן להתחיל הקלטה: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('עוצר הקלטה...');
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow" dir="rtl">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
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
            <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap text-right">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;