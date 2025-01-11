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
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Recording chunk:', event.data.size);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        console.log('Recording completed');
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      console.log('Recording started');
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
      console.log('Recording stopped');
    }
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = fileName || 'recording.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log('Download initiated');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      <div className="space-y-6">
        <div className="mb-4">
          <button
            onClick={isTesting ? stopTesting : testMicrophone}
            className={`px-4 py-2 rounded-lg font-medium text-white ${
              isTesting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } ml-4`}
          >
            {isTesting ? 'הפסק בדיקה' : 'בדוק מיקרופון'}
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
                עוצמת מיקרופון: {Math.round(micVolume)}%
              </p>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-2 rounded-lg font-medium text-white ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } ml-4`}
            disabled={isTesting}
          >
            {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
          </button>

          {isRecording && (
            <span className="inline-flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse ml-2" />
              מקליט...
            </span>
          )}
        </div>

        {audioURL && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם הקובץ:
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-3 py-2 border rounded w-full max-w-xs"
                dir="ltr"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">השמעת הקלטה</h3>
              <audio controls src={audioURL} className="w-full mb-4" />
              <button
                onClick={downloadRecording}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                הורד הקלטה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;