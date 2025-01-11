import React, { useState } from 'react';

const ClientManager = () => {
  const [clients, setClients] = useState([
    { id: 1, name: 'ישראל ישראלי', email: 'israel@example.com', lastMeeting: '2024-01-01' },
    { id: 2, name: 'שרה כהן', email: 'sarah@example.com', lastMeeting: '2024-01-05' }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="col-span-1">
          <h3 className="text-lg font-medium mb-4">לקוחות</h3>
          <div className="space-y-2">
            {clients.map(client => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedClient?.id === client.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-gray-500">{client.email}</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            הוסף לקוח +
          </button>
        </div>

        {/* Client Details */}
        {selectedClient ? (
          <div className="col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">פרטי לקוח</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">שם</label>
                  <input
                    type="text"
                    value={selectedClient.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">אימייל</label>
                  <input
                    type="email"
                    value={selectedClient.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Recent Meetings */}
            <div>
              <h3 className="text-lg font-medium mb-4">פגישות אחרונות</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">עדכון צרכים</div>
                  <div className="text-sm text-gray-500">01/01/2024</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">סקירת תיק</div>
                  <div className="text-sm text-gray-500">15/12/2023</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                פגישה חדשה
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                ערוך פרטים
              </button>
            </div>
          </div>
        ) : (
          <div className="col-span-2 flex items-center justify-center text-gray-500">
            בחר לקוח להצגת פרטים
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager;