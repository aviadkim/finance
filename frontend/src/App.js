import React from 'react';
import './App.css';
import MeetingForm from './components/MeetingForm/MeetingForm';
import SystemTester from './components/SystemTester';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>מערכת ניהול שיחות ותיעוד רגולטורי</h1>
      </header>
      <main>
        <MeetingForm />
        <SystemTester />
      </main>
    </div>
  );
}

export default App;