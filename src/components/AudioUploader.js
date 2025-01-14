import React, { useState, useEffect } from 'react';
import { SystemDebugger } from '../utils/SystemDebugger';

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speakers, setSpeakers] = useState([]);

  const handleFileUpload = async (event) => {
    const audioFile = event.target.files[0];
    setFile(audioFile);
    setIsProcessing(true);

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Start processing the audio
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      // Start transcription
      await startTranscription(source);
      
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startTranscription = async (audioSource) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'he-IL'; // ניתן לשנות ל-'en-US' עבור אנגלית

    let currentSpeaker = null;
    let currentText = '';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          // זיהוי דובר
          if (!currentSpeaker || Math.random() < 0.3) { // החלפת דובר
            currentSpeaker = {
              id: speakers.length + 1,
              color: getRandomColor()
            };
            setSpeakers(prev => [...prev, currentSpeaker]);
          }

          const newText = result[0].transcript;
          setTranscript(prev => prev + \`
            <span style="color: \${currentSpeaker.color}">\${newText}</span>
          \`);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };

    // Start playing and recognition
    audioSource.start(0);
    recognition.start();
  };

  const getRandomColor = () => {
    const colors = ['#E57373', '#64B5F6', '#81C784', '#FFB74D'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">העלאת הקלטה</h3>
        
        {/* Upload button */}
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          בחר קובץ אודיו
        </label>

        {/* File name */}
        {file && (
          <div className="text-sm">
            נבחר: {file.name}
          </div>
        )}

        {/* Loading indicator */}
        {isProcessing && (
          <div className="text-sm text-gray-600">
            מעבד את הקובץ...
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div 
            className="mt-4 p-4 border rounded bg-white min-h-[200px]"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: transcript }}
          />
        )}
      </div>
    </div>
  );
};

export default AudioUploader;