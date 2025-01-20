import React, { useState } from 'react';

const ClientList = () => {
  const [clients] = useState([
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
  ]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          + לקוח חדש
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="חיפוש לקוחות..."
            className="border rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <div className="text-sm text-gray-500">
                {client.lastMeeting} :פגישה אחרונה
              </div>
            </div>
            <div className="mt-2 text-gray-600">
              <p>{client.phone}</p>
              <p>{client.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;