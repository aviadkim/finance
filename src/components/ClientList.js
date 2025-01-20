import React from 'react';

const ClientList = () => {
  const clients = [
    {
      id: 1,
      name: 'ישראל ישראלי',
      phone: '050-1234567',
      email: 'israel@email.com',
      lastMeeting: '2024-01-15',
    },
    {
      id: 2,
      name: 'שרה כהן',
      phone: '052-7654321',
      email: 'sarah@email.com',
      lastMeeting: '2024-01-10',
    },
  ];

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <div className="text-sm text-gray-500 text-right">
              פגישה אחרונה: {client.lastMeeting}
            </div>
          </div>
          <div className="mt-2 text-gray-600 text-right">
            <p>{client.phone}</p>
            <p>{client.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientList;