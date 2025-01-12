import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('recording');

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold">מערכת ניהול פגישות</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('recording')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              הקלטת פגישה חדשה
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Test Update - Please Confirm You See This</h2>
          <p>This is a test to verify deployment is working</p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            כפתור בדיקה
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;