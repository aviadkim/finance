import { useState, useRef, useEffect } from 'react';
import AudioRecorder from '../services/audioRecorder';
import { TranscriptionService } from '../services/transcriptionService';

export function useRecording(onTranscript) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const transcriptionServiceRef = useRef(null);

  useEffect(() => {
    recorderRef.current = new AudioRecorder();
    transcriptionServiceRef.current = new TranscriptionService(process.env.REACT_APP_OPENAI_API_KEY);
  }, []);

  const startRecording = async () => {
    const success = await recorderRef.current.startRecording();
    if (success) {
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    const audioBlob = await recorderRef.current.stopRecording();
    setIsRecording(false);

    const transcript = await transcriptionServiceRef.current.transcribeAudio(audioBlob);
    if (onTranscript) {
      onTranscript(transcript);
    }

    return transcript;
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
}