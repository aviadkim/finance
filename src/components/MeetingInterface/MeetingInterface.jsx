import React, { useState } from 'react';

const MeetingInterface = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
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
      console.log('File uploaded:', file.name);
      setAudioFile(file);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Add actual recording logic here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Add stop recording logic here
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-right">מערכת ניהול פיננסי</h1>
      
      {/* Meeting Types Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-right">סוגי פגישות</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {initialMeetingTypes.map((type) => (
            <div key={type.id} className="bg-gray-50 p-4 rounded-lg text-right hover:bg-gray-100 transition-colors cursor-pointer">
              <h3 className="font-semibold whitespace-pre-line">{type.title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recording Section */}
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
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md transition-colors`}
            >
              {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
            </button>
          </div>
        </div>

        <div className="text-center text-2xl font-mono mb-4">
          {formatTime(recordingTime)}
        </div>

        {audioFile && (
          <div className="text-right text-sm text-gray-600 mt-2">
            קובץ נוכחי: {audioFile.name}
          </div>
        )}
      </div>

      {/* Transcription Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-right">תמלולים</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
            התחל תמלול
          </button>
        </div>

        <div className="min-h-[100px] bg-gray-50 rounded-lg p-4 text-right">
          {/* Transcription will appear here */}
          <p className="text-gray-500">התמלול יופיע כאן...</p>
        </div>
      </div>
    </div>
  );
};

export default MeetingInterface;