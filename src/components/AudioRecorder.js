import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  // ... other states ...
  const [transcript, setTranscript] = useState('');
  const [tempTranscript, setTempTranscript] = useState('');
  const recognition = useRef(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'he-IL';

      recognition.current.onresult = (event) => {
        const lastResult = Array.from(event.results).pop();
        if (lastResult.isFinal) {
          setTranscript(prev => prev + ' ' + lastResult[0].transcript);
          setTempTranscript('');
        } else {
          setTempTranscript(lastResult[0].transcript);
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, []);

  // ... rest of the component code ...

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* ... other UI elements ... */}

      {/* Transcript Display */}
      {(transcript || tempTranscript) && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">תמליל</h3>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
            {transcript}
            <span className="text-gray-500">{tempTranscript}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;