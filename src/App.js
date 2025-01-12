import React, { useState } from 'react';

function App() {
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('recording');

  const checkSystemStatus = () => {
    const foundErrors = [];
    
    // Check audio capabilities
    if (!navigator?.mediaDevices?.getUserMedia) {
      foundErrors.push('No audio recording capabilities found');
    }

    // Check browser features
    if (!window.localStorage) {
      foundErrors.push('LocalStorage not available');
    }

    // Check file system access
    if (!window.fs) {
      foundErrors.push('File system access not available');
    }

    // Update the errors state
    setErrors(foundErrors);

    // Log system info
    console.log('Browser Info:', navigator.userAgent);
    console.log('Window Size:', window.innerWidth, window.innerHeight);
    console.log('Available APIs:', {
      mediaDevices: !!navigator.mediaDevices,
      localStorage: !!window.localStorage,
      fs: !!window.fs,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold">מערכת ניהול פגישות</h1>
          <button 
            onClick={checkSystemStatus}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            בדיקת מערכת
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Error Display */}
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-bold text-red-700 mb-2">נמצאו שגיאות:</h3>
              <ul className="list-disc list-inside text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* System Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">סטטוס מערכת:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">דפדפן:</div>
                <div className="text-sm text-gray-600">{navigator.userAgent}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">גודל חלון:</div>
                <div className="text-sm text-gray-600">
                  {window.innerWidth} x {window.innerHeight}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;