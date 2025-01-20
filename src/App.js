import React from 'react';

function App() {
  console.log('New App version rendering');
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        מערכת ניהול פיננסי - גרסה חדשה
      </h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center
                     hover:border-blue-400 cursor-pointer transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            console.log('File dropped:', file?.name);
          }}
        >
          <p className="text-gray-600 text-lg">גרור קובץ אודיו לכאן</p>
          <p className="text-sm text-gray-500 mt-2">או</p>
          <label className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg 
                            cursor-pointer hover:bg-blue-600 transition-colors">
            בחר קובץ
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                console.log('File selected:', file?.name);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;