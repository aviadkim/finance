import React, { useState } from 'react';
import RecordingSession from '../components/RecordingSession';
import RegulatoryQuestions from '../components/RegulatoryQuestions';
import MeetingSummary from '../components/MeetingSummary';

const MeetingDashboard = () => {
  const [transcript, setTranscript] = useState('');
  const [meetingState, setMeetingState] = useState({
    isActive: false,
    startTime: null,
    clientName: ''
  });

  const startMeeting = (clientName) => {
    setMeetingState({
      isActive: true,
      startTime: new Date(),
      clientName
    });
  };

  const endMeeting = async () => {
    // Generate summary and save meeting data
    setMeetingState(prev => ({
      ...prev,
      isActive: false
    }));
  };

  return (
    <div className="meeting-dashboard">
      <div className="meeting-header">
        <h1>פגישת ייעוץ</h1>
        {!meetingState.isActive ? (
          <div className="start-meeting">
            <input 
              type="text" 
              placeholder="שם הלקוח"
              onChange={(e) => setMeetingState(prev => ({
                ...prev,
                clientName: e.target.value
              }))}
            />
            <button 
              onClick={() => startMeeting(meetingState.clientName)}
              disabled={!meetingState.clientName}
            >
              התחל פגישה
            </button>
          </div>
        ) : (
          <button onClick={endMeeting}>סיים פגישה</button>
        )}
      </div>

      {meetingState.isActive && (
        <div className="meeting-content">
          <div className="recording-section">
            <RecordingSession 
              onTranscriptUpdate={setTranscript}
            />
          </div>
          
          <div className="regulatory-section">
            <RegulatoryQuestions 
              transcript={transcript}
            />
          </div>

          <div className="summary-section">
            <MeetingSummary 
              transcript={transcript}
              clientName={meetingState.clientName}
              startTime={meetingState.startTime}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingDashboard;