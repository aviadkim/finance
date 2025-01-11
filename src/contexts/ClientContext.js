import React, { createContext, useContext, useState } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedView, setSelectedView] = useState('dashboard');
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: 'ישראל ישראלי',
      email: 'israel@example.com',
      portfolio: {
        totalValue: 1250000,
        lastUpdate: '2024-01-01',
        allocations: {
          stocks: 60,
          bonds: 30,
          cash: 10
        }
      }
    }
  ]);

  return (
    <ClientContext.Provider value={{
      selectedClient,
      setSelectedClient,
      selectedView,
      setSelectedView,
      clients,
      setClients
    }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);