import React, { useState } from 'react';
import { initialQuestions } from '../../utils/regulatoryQuestions';

const MeetingInterface = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // טיפוסי פגישות בסיסיים
  const initialMeetingTypes = [
    {
      id: 'initial',
      title: 'שיחת היכרות\nראשונית',
      description: 'מטרת שיחה זו היא\nלהכיר את הלקוח...',
      questions: initialQuestions.initial
    },
    {
      id: 'update',
      title: 'שיחת עדכון\nצרכים שוטף',
      description: 'מטרת שיחה זו היא\nלוודא שמדיניות...',
      questions: initialQuestions.update
    },
    {
      id: 'marketing',
      title: 'שיחת שיווק\nשוטפת',
      description: 'מטרת שיחה זו היא\nלתת מענה לצרכים...',
      questions: initialQuestions.marketing
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
      setAudioFile(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-right">שאלות רגולטוריות</h2>
        <div className="flex space-x-2">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 ml-2"
          >
            העלה הקלטה
          </label>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            התחל הקלטה
          </button>
        </div>
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
          00:00
        </div>
        {audioFile && (
          <div className="text-right text-sm text-gray-600">
            קובץ נוכחי: {audioFile.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingInterface;