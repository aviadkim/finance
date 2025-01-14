import React, { useState } from 'react';
import { SystemDebugger } from '../utils/SystemDebugger';

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      
      // הפעלת תמלול אוטומטי
      startTranscription(source);
      
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startTranscription = (audioSource) => {
    // הוספת הלוגיקה של התמלול כאן
  };

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">העלאת הקלטה</h3>
        
        {/* כפתור העלאה */}
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          בחר קובץ אודיו
        </label>

        {/* הצגת שם הקובץ */}
        {file && (
          <div className="text-sm">
            נבחר: {file.name}
          </div>
        )}

        {/* מחוון טעינה */}
        {isProcessing && (
          <div className="text-sm text-gray-600">
            מעבד את הקובץ...
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUploader;