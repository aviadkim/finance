import React, { useState, useEffect } from 'react';

const MeetingInterface = () => {
  console.log('MeetingInterface component rendered - v1.0.3');
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    console.log('MeetingInterface mounted');
  }, []);

  const handleDrop = (e) => {
    console.log('File drop event triggered');
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      console.log('Processing dropped file:', files[0].name);
      if (files[0].type.startsWith('audio/')) {
        setAudioFile(files[0]);
        console.log('Audio file set successfully');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drag enter event');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drag leave event');
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-2xl font-mono p-4 bg-gray-50 rounded-lg">
        {isRecording ? '00:00' : 'לא מקליט'}
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${audioFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {audioFile ? (
          <>
            <p className="text-green-600 font-medium text-lg">הקובץ הועלה בהצלחה:</p>
            <p className="text-gray-600 mt-2">{audioFile.name}</p>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-lg">גרור קובץ אודיו לכאן</p>
            <p className="text-sm text-gray-500 mt-2">או</p>
            <label className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              בחר קובץ
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  console.log('File input change');
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log('Setting file:', file.name);
                    setAudioFile(file);
                  }
                }}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default MeetingInterface;