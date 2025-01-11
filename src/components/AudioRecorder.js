import React, { useState, useRef } from 'react';
import TranscriptionService from '../services/TranscriptionService';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [usePaidService, setUsePaidService] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      if (!usePaidService) {
        TranscriptionService.startFreeTranscription(
          (newTranscript) => {
            setTranscript(prev => prev + ' ' + newTranscript);
          },
          (error) => console.error('Transcription error:', error)
        );
      }

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        if (usePaidService) {
          try {
            const paidTranscript = await TranscriptionService.startPaidTranscription(audioBlob);
            setTranscript(paidTranscript);
          } catch (error) {
            console.error('Paid transcription error:', error);
          }
        }

        const quickSummary = await TranscriptionService.getQuickSummary(transcript);
        setAnalysis(quickSummary);
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      if (!usePaidService) {
        TranscriptionService.stopFreeTranscription();
      }
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setUploadedFileName(file.name);
        const url = URL.createObjectURL(file);
        setAudioURL(url);

        // Start transcription for uploaded file
        if (!usePaidService) {
          // For free service, we'll need to play the audio to transcribe
          const audio = new Audio(url);
          audio.addEventListener('play', () => {
            TranscriptionService.startFreeTranscription(
              (newTranscript) => {
                setTranscript(prev => prev + ' ' + newTranscript);
              },
              (error) => console.error('Transcription error:', error)
            );
          });
          audio.addEventListener('ended', () => {
            TranscriptionService.stopFreeTranscription();
          });
        } else {
          // For paid service, we can send the file directly
          try {
            const paidTranscript = await TranscriptionService.startPaidTranscription(file);
            setTranscript(paidTranscript);
          } catch (error) {
            console.error('Paid transcription error:', error);
          }
        }
      } catch (error) {
        console.error('Error handling file upload:', error);
      }
    }
  };

  const copyPromptToClipboard = () => {
    if (analysis?.copyToClipboard) {
      analysis.copyToClipboard();
      alert('הועתק ללוח! כעת הדבק ב-ChatGPT לקבלת ניתוח');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4" dir="rtl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-x-4 flex items-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-2 rounded-lg font-medium text-white ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
            </button>

            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="audio/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
              >
                העלה הקלטה
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="mr-2">שירות בתשלום</label>
            <input
              type="checkbox"
              checked={usePaidService}
              onChange={(e) => setUsePaidService(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
          </div>
        </div>

        {isRecording && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="mr-2">מקליט...</span>
          </div>
        )}

        {uploadedFileName && (
          <div className="text-sm text-gray-600">
            קובץ שהועלה: {uploadedFileName}
          </div>
        )}

        {transcript && (
          <div>
            <h3 className="text-lg font-medium mb-2">תמליל</h3>
            <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}

        {audioURL && (
          <div>
            <h3 className="text-lg font-medium mb-2">הקלטה</h3>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}

        {analysis && (
          <div className="mt-4">
            <button
              onClick={copyPromptToClipboard}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              העתק שאילתה ל-ChatGPT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;