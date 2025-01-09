import React from 'react';
import './App.css';
import AdvisorDashboard from './components/AdvisorDashboard';
import ClientHistory from './components/ClientHistory';
import CallAnalyzer from './components/CallAnalyzer';
import SystemTester from './components/SystemTester';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>מערכת ניהול שיחות ותיעוד רגולטורי</h1>
      </header>
      <main className="App-main">
        <SystemTester />
        <AdvisorDashboard />
        <ClientHistory />
        <CallAnalyzer />
      </main>
    </div>
  );
}

export default App;