import React, { useState, useEffect } from 'react';

const MeetingInterface = () => {
  console.log('MeetingInterface component rendered');
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    console.log('Component mounted, version 1.0.1');
    console.log('Current timestamp:', new Date().toISOString());
    console.log('Environment:', process.env.NODE_ENV);
  }, []);

  const handleDrop = (e) => {
    console.log('File drop event triggered');
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
    
    if (files && files[0]) {
      console.log('File type:', files[0].type);
      if (files[0].type.startsWith('audio/')) {
        console.log('Valid audio file detected:', files[0].name);
        setAudioFile(files[0]);
      } else {
        console.warn('Invalid file type dropped:', files[0].type);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    console.log('Drag over event');
  };

  const handleFileChange = (e) => {
    console.log('File input change event triggered');
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name, 'Type:', file.type);
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        console.log('Audio file set successfully');
      } else {
        console.warn('Invalid file type selected');
      }
    }
  };

  console.log('Current audioFile state:', audioFile);

  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-4">
      <div className="text-center text-2xl font-mono mb-4">
        {isRecording ? '00:00' : 'לא מקליט'}
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${audioFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        id="dropzone"
      >
        {audioFile ? (
          <>
            <p className="text-green-600 font-medium">הקובץ הועלה בהצלחה:</p>
            <p className="text-gray-600" id="filename">{audioFile.name}</p>
          </>
        ) : (
          <>
            <p className="text-gray-600">גרור קובץ אודיו לכאן</p>
            <p className="text-sm text-gray-500">או</p>
            <label className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600">
              בחר קובץ
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
                id="file-input"
              />
            </label>
          </>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Build Version: {process.env.REACT_APP_VERSION || '1.0.1'}
        <br />
        Last Updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default MeetingInterface;