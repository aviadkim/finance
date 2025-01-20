import React from 'react';
import MeetingInterface from './components/MeetingInterface/MeetingInterface';
import './index.css';

function App() {
  console.log('App component rendered - v1.0.3');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
            מערכת ניהול פיננסי
          </h1>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <section>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">הקלטות פגישות</h2>
                <MeetingInterface />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;