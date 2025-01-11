import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ClientDashboard from './components/ClientDashboard';
import MeetingRecorder from './components/MeetingRecorder';
import ClientPortfolio from './components/ClientPortfolio';
import MeetingHistory from './components/MeetingHistory';
import ClientHeader from './components/ClientHeader';

function App() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      {/* Sidebar */}
      <Sidebar 
        selectedView={selectedView} 
        onViewChange={setSelectedView}
        selectedClient={selectedClient}
        onClientSelect={setSelectedClient}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {selectedClient && <ClientHeader client={selectedClient} />}
        
        <div className="p-6">
          {selectedView === 'dashboard' && <ClientDashboard client={selectedClient} />}
          {selectedView === 'meeting' && <MeetingRecorder client={selectedClient} />}
          {selectedView === 'portfolio' && <ClientPortfolio client={selectedClient} />}
          {selectedView === 'history' && <MeetingHistory client={selectedClient} />}
        </div>
      </main>
    </div>
  );
}

export default App;