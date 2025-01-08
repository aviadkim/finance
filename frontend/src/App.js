import React from 'react';
import RecordingSession from './components/RecordingSession';
import RegulatoryQuestions from './components/RegulatoryQuestions';
import MeetingSummary from './components/MeetingSummary';

function App() {
  return (
    <div className='App'>
      <h1>מערכת ייעוץ פיננסי</h1>
      <div className='main-content'>
        <RecordingSession />
        <RegulatoryQuestions />
        <MeetingSummary />
      </div>
    </div>
  );
}

export default App;