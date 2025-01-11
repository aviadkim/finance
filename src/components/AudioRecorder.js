import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [fileName, setFileName] = useState('recording.wav');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      setIsTesting(true);
      
      const checkVolume = () => {
        if (!isTesting) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setMicVolume(average);
        
        requestAnimationFrame(checkVolume);
      };
      
      checkVolume();
    } catch (err) {
      console.error('Microphone test error:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopTesting = () => {
    setIsTesting(false);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setMicVolume(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      alert('Could not start recording: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Microphone Test */}
        <div className="mb-4">
          <button
            onClick={isTesting ? stopTesting : testMicrophone}
            className={`px-4 py-2 rounded ${
              isTesting ? 'bg-red-500' : 'bg-green-500'
            } text-white mr-4`}
          >
            {isTesting ? 'Stop Test' : 'Test Microphone'}
          </button>
          
          {isTesting && (
            <div className="mt-2">
              <div className="relative h-4 bg-gray-200 rounded">
                <div
                  className="absolute h-full bg-blue-500 rounded transition-all"
                  style={{ width: `${Math.min(100, micVolume)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Microphone Level: {Math.round(micVolume)}%
              </p>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-2 rounded-lg font-medium text-white ${
              isRecording ? 'bg-red-500' : 'bg-blue-500'
            } mr-4`}
            disabled={isTesting}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>

          {isRecording && (
            <span className="inline-flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
              Recording...
            </span>
          )}
        </div>

        {/* File Name Input */}
        {audioURL && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Name:
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="px-3 py-2 border rounded w-full max-w-xs"
            />
          </div>
        )}

        {/* Audio Playback */}
        {audioURL && (
          <div>
            <h3 className="text-lg font-medium mb-2">Recording Playback</h3>
            <audio controls src={audioURL} className="w-full mb-4" />
            <button
              onClick={downloadRecording}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;