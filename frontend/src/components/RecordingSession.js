import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const RecordingSession = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    
    newSocket.on('transcript', (text) => {
      setTranscript(prev => prev + '\n' + text);
    });

    return () => newSocket.close();
  }, []);

  const startRecording = () => {
    if (!socket) return;
    socket.emit('start_recording');
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!socket) return;
    socket.emit('stop_recording');
    setIsRecording(false);
  };

  return (
    <div className="recording-session">
      <div className="controls">
        {!isRecording ? (
          <button onClick={startRecording}>התחל הקלטה</button>
        ) : (
          <button onClick={stopRecording}>עצור הקלטה</button>
        )}
      </div>
      <div className="transcript">
        <h3>תמלול שיחה:</h3>
        <pre>{transcript}</pre>
      </div>
    </div>
  );
};

export default RecordingSession;