import React, { useState } from 'react';
import './index.css';

function App() {
  console.log('App rendering v1.0.4');
  const [audioFile, setAudioFile] = useState(null);

  const handleDrop = (e) => {
    console.log('Drop event triggered');
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type.startsWith('audio/')) {
        setAudioFile(files[0]);
        console.log('Audio file set:', files[0].name);
      }
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">
            מערכת ניהול פיננסי
          </h1>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">הקלטות פגישות</h2>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${audioFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {audioFile ? (
              <>
                <p className="text-green-600 font-medium text-lg">הקובץ הועלה בהצלחה:</p>
                <p className="text-gray-600 mt-2">{audioFile.name}</p>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-lg">גרור קובץ אודיו לכאן</p>
                <p className="text-sm text-gray-500 mt-2">או</p>
                <label className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  בחר קובץ
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log('File selected:', file.name);
                        setAudioFile(file);
                      }
                    }}
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;