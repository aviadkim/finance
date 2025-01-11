import React, { useState } from 'react';

const Sidebar = ({ selectedView, onViewChange, selectedClient, onClientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([
    { id: 1, name: 'ישראל ישראלי', email: 'israel@example.com' },
    { id: 2, name: 'שרה כהן', email: 'sarah@example.com' }
  ]);

  const menuItems = [
    { id: 'dashboard', label: 'סקירה כללית', icon: '📊' },
    { id: 'meeting', label: 'פגישה חדשה', icon: '🎯' },
    { id: 'portfolio', label: 'תיק השקעות', icon: '📈' },
    { id: 'history', label: 'היסטוריית פגישות', icon: '📅' }
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="חיפוש לקוח..."
          className="w-full px-3 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto p-4 border-b">
        <h3 className="text-sm font-medium text-gray-500 mb-2">לקוחות</h3>
        {clients
          .filter(client => client.name.includes(searchTerm))
          .map(client => (
            <div
              key={client.id}
              onClick={() => onClientSelect(client)}
              className={`p-2 rounded-lg cursor-pointer mb-1 ${selectedClient?.id === client.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              <div className="font-medium">{client.name}</div>
              <div className="text-sm text-gray-500">{client.email}</div>
            </div>
          ))}
      </div>

      {/* Menu */}
      <div className="p-4">
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`p-2 rounded-lg cursor-pointer mb-1 flex items-center ${selectedView === item.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Add Client Button */}
      <div className="p-4 border-t">
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          לקוח חדש +
        </button>
      </div>
    </div>
  );
};

export default Sidebar;