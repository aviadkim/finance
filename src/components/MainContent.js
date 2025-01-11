import React from 'react';
import { useClient } from '../contexts/ClientContext';
import ClientDashboard from './ClientDashboard';
import MeetingRecorder from './MeetingRecorder';
import ClientPortfolio from './ClientPortfolio';
import MeetingHistory from './MeetingHistory';

const MainContent = () => {
  const { selectedView, selectedClient } = useClient();

  const renderContent = () => {
    switch(selectedView) {
      case 'dashboard':
        return <ClientDashboard />;
      case 'meeting':
        return <MeetingRecorder />;
      case 'portfolio':
        return <ClientPortfolio />;
      case 'history':
        return <MeetingHistory />;
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {renderContent()}
    </main>
  );
};