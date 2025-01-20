import React, { useState } from 'react';
import { initialQuestions } from '../../utils/regulatoryQuestions';

const MeetingInterface = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  
  const initialMeetingTypes = [
    {
      id: 'initial',
      title: 'שיחת היכרות\nראשונית',
      description: 'מטרת שיחה זו היא\nלהכיר את הלקוח...',
    },
    {
      id: 'update',
      title: 'שיחת עדכון\nצרכים שוטף',
      description: 'מטרת שיחה זו היא\nלוודא שמדיניות...',
    },
    {
      id: 'marketing',
      title: 'שיחת שיווק\nשוטפת',
      description: 'מטרת שיחה זו היא\nלתת מענה לצרכים...',
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      console.log('File uploaded:', file.name);
    }
  };

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
  };

  const handleMeetingSelect = (meetingType) => {
    setSelectedMeeting(meetingType);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-right">הקלטות פגישות</h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
            >
              העלה הקלטה
            </label>
            <button
              onClick={handleRecordingToggle}
              className={`${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white px-4 py-2 rounded-md`}
            >
              {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {initialMeetingTypes.map((type) => (
            <div
              key={type.id}
              className={`bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedMeeting?.id === type.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleMeetingSelect(type)}
            >
              <h3 className="font-semibold whitespace-pre-line text-right">{type.title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line text-right">
                {type.description}
              </p>
            </div>
          ))}
        </div>

        {/* שאלות רגולטוריות */}
        {selectedMeeting && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-4 text-right">שאלות לשיחה:</h3>
            <ul className="space-y-2 text-right">
              {initialQuestions[selectedMeeting.id].map((question, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* תמלול */}
        <div className="mt-6">
          <div className="min-h-[200px] bg-gray-50 rounded-lg p-4 text-right">
            {isRecording ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">מתמלל...</p>
              </div>
            ) : transcriptionText ? (
              <p>{transcriptionText}</p>
            ) : (
              <p className="text-gray-500">התמלול יופיע כאן...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingInterface;