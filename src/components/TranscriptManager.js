import React, { useEffect, useState } from 'react';
import { SpeakerDetection } from '../utils/SpeakerDetection';
import { sendTranscriptEmail } from '../services/EmailService';

const TranscriptManager = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [debug, setDebug] = useState({});

  useEffect(() => {
    console.log('TranscriptManager: Initializing...');
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setDebug(prev => ({ ...prev, error: 'Speech recognition not supported' }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'he-IL';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const speaker = SpeakerDetection.identifySpeaker(result);
          setSpeakers(prev => [...prev, speaker]);
          setDebug(prev => ({ ...prev, lastSpeaker: speaker }));
        }
        currentTranscript += result[0].transcript + ' ';
      }
      setTranscript(currentTranscript);
      setDebug(prev => ({ ...prev, lastTranscript: currentTranscript }));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setDebug(prev => ({ ...prev, error: event.error }));
      setIsRecording(false);
    };

    setRecognition(recognition);
    setDebug(prev => ({ ...prev, status: 'Initialized' }));
  }, []);

  const startRecording = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsRecording(true);
        setDebug(prev => ({ ...prev, status: 'Recording started' }));
      } catch (error) {
        console.error('Error starting recording:', error);
        setDebug(prev => ({ ...prev, error: error.message }));
      }
    }
  };

  const stopRecording = async () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      setDebug(prev => ({ ...prev, status: 'Recording stopped' }));

      try {
        await sendTranscriptEmail({
          transcript,
          speakers,
          duration: '00:30:00',
          clientEmail: 'client@example.com'
        });
        setDebug(prev => ({ ...prev, emailStatus: 'Email sent successfully' }));
      } catch (error) {
        console.error('Error sending email:', error);
        setDebug(prev => ({ ...prev, emailError: error.message }));
      }
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
      </button>
      <div className="mt-4 p-4 border rounded bg-white min-h-[200px]" dir="rtl">
        <div className="transcript-container">
          {speakers.map((speaker, index) => (
            <p 
              key={index} 
              style={{ color: SpeakerDetection.getColorForSpeaker(speaker.speakerId) }}
            >
              {transcript.split(' ')[index]}
            </p>
          ))}
        </div>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
          <pre>{JSON.stringify(debug, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TranscriptManager;