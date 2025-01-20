import React, { useState } from 'react';

const MeetingRecorder = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

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

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4 gap-4">
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

        {audioFile && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              קובץ נוכחי: {audioFile.name}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {initialMeetingTypes.map((type) => (
          <div
            key={type.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2 whitespace-pre-line">
              {type.title}
            </h3>
            <p className="text-gray-600 text-sm whitespace-pre-line">
              {type.description}
            </p>
          </div>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center text-2xl font-mono mt-4">
        00:00
      </div>
    </div>
  );
};

export default MeetingRecorder;