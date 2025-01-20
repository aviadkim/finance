import React, { useState } from 'react';
import { initialQuestions } from '../../utils/regulatoryQuestions';

const MeetingInterface = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  const initialMeetingTypes = [
    {
      id: 'initial',
      title: 'שיחת היכרות ראשונית',
      description: 'מטרת שיחה זו היא להכיר את הלקוח...',
    },
    {
      id: 'update',
      title: 'שיחת עדכון צרכים שוטף',
      description: 'מטרת שיחה זו היא לוודא שמדיניות...',
    },
    {
      id: 'marketing',
      title: 'שיחת שיווק שוטפת',
      description: 'מטרת שיחה זו היא לתת מענה לצרכים...',
    }
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type.startsWith('audio/')) {
        setAudioFile(files[0]);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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
      >
        {audioFile ? (
          <>
            <p className="text-green-600 font-medium">הקובץ הועלה בהצלחה:</p>
            <p className="text-gray-600">{audioFile.name}</p>
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
                onChange={(e) => e.target.files[0] && setAudioFile(e.target.files[0])}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default MeetingInterface;