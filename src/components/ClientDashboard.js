import React from 'react';
import { useClient } from '../contexts/ClientContext';
import PortfolioSummary from './dashboard/PortfolioSummary';
import RecentMeetings from './dashboard/RecentMeetings';
import ClientTasks from './dashboard/ClientTasks';

const ClientDashboard = () => {
  const { selectedClient } = useClient();

  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-600">בחר לקוח להצגת מידע</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PortfolioSummary />
        <RecentMeetings />
        <ClientTasks />
      </div>
    </div>
  );
};