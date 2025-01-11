import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [activeSection, setActiveSection] = useState('record');

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo/Title */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">מערכת ניהול פגישות</h1>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden sm:mr-6 sm:flex sm:space-x-8">
                <button 
                  onClick={() => setActiveSection('record')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeSection === 'record' 
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  הקלטת פגישה
                </button>
                <button 
                  onClick={() => setActiveSection('clients')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeSection === 'clients'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ניהול לקוחות
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Recording Section */}
        {activeSection === 'record' && (
          <div className="px-4 py-6 sm:px-0">
            <AudioRecorder />
          </div>
        )}

        {/* Client Management Section */}
        {activeSection === 'clients' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">ניהול לקוחות</h2>
              {/* Client list will go here */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;