import React, { useState } from 'react';

const MeetingRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Add actual recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Add stop recording logic
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
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
          className={`${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-4 py-2 rounded-md`}
        >
          {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
        </button>
      </div>

      {audioFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            קובץ נוכחי: {audioFile.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default MeetingRecorder;