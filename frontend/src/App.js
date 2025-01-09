import React from 'react';
import './App.css';
import AdvisorDashboard from './components/AdvisorDashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>מערכת ניהול שיחות ותיעוד רגולטורי</h1>
      </header>
      <AdvisorDashboard />
    </div>
  );
}

export default App;