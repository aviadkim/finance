import React from 'react';
import './App.css';
import MeetingInterface from './components/MeetingInterface/MeetingInterface';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>מערכת ניהול שיחות ותיעוד רגולטורי</h1>
      </header>
      <MeetingInterface />
    </div>
  );
}

export default App;