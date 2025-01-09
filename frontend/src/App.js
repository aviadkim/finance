import React from 'react';
import './App.css';
import AdvisorDashboard from './components/AdvisorDashboard';
import ClientHistory from './components/ClientHistory';
import CallAnalyzer from './components/CallAnalyzer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>מערכת ניהול שיחות ותיעוד רגולטורי</h1>
      </header>
      <main className="App-main">
        <AdvisorDashboard />
        <ClientHistory />
        <CallAnalyzer />
      </main>
    </div>
  );
}

export default App;