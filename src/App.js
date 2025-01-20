import React from 'react';
import MeetingInterface from './components/MeetingInterface/MeetingInterface';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-right">
            מערכת ניהול פיננסי
          </h1>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <MeetingInterface />
      </main>
    </div>
  );
}

export default App;