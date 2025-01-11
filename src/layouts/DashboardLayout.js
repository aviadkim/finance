import React from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { useClient } from '../contexts/ClientContext';

const DashboardLayout = () => {
  const { selectedView } = useClient();

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default DashboardLayout;