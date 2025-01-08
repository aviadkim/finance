import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MeetingRoom from './pages/MeetingRoom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meeting" element={<MeetingRoom />} />
      </Routes>
    </Router>
  );
}