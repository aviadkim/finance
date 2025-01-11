import React, { useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import { ClientProvider } from './contexts/ClientContext';

function App() {
  return (
    <ClientProvider>
      <DashboardLayout />
    </ClientProvider>
  );
}

export default App;