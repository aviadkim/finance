import React, { useState } from 'react';
import { initialQuestions } from '../../utils/regulatoryQuestions';

const MeetingInterface = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-right">שאלות רגולטוריות</h2>
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`${
            isRecording ? 'bg-red-500' : 'bg-blue-500'
          } text-white px-4 py-2 rounded-md`}
        >
          {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {initialMeetingTypes.map((type) => (
          <div
            key={type.id}
            className={`bg-gray-50 p-4 rounded-lg text-right cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedMeeting?.id === type.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedMeeting(type)}
          >
            <h3 className="font-semibold whitespace-pre-line">{type.title}</h3>
            <p className="text-gray-600 text-sm whitespace-pre-line">{type.description}</p>
          </div>
        ))}
      </div>

      {selectedMeeting && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-right">שאלות לשיחת {selectedMeeting.title}</h3>
          <ul className="space-y-2 list-disc list-inside text-right">
            {initialQuestions[selectedMeeting.id].map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}

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
    </div>
  );
};

export default MeetingInterface;