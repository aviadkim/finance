import React, { useState } from 'react';

const ClientList = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'ישראל ישראלי',
      phone: '050-1234567',
      email: 'israel@email.com',
      lastMeeting: '2024-01-15',
      recordingsCount: 2
    },
    {
      id: 2,
      name: 'שרה כהן',
      phone: '052-7654321',
      email: 'sarah@email.com',
      lastMeeting: '2024-01-10',
      recordingsCount: 1
    }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">ניהול לקוחות</h2>
        <button 
          onClick={() => setShowNewClientForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          לקוח חדש +
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(client => (
          <div 
            key={client.id} 
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedClient(client)}
          >
            <div className="font-medium">{client.name}</div>
            <div className="text-sm text-gray-600">{client.phone}</div>
            <div className="text-sm text-gray-600">{client.email}</div>
            <div className="mt-2 text-sm">
              <span className="text-blue-600">{client.recordingsCount} הקלטות</span>
              <span className="mx-2">•</span>
              <span>פגישה אחרונה: {client.lastMeeting}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">פרטי לקוח</h3>
              <button 
                onClick={() => setSelectedClient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="font-medium">שם מלא</div>
                <div>{selectedClient.name}</div>
              </div>
              <div>
                <div className="font-medium">טלפון</div>
                <div>{selectedClient.phone}</div>
              </div>
              <div>
                <div className="font-medium">אימייל</div>
                <div>{selectedClient.email}</div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">הקלטות אחרונות</h4>
                <div className="space-y-2">
                  {[1, 2].map(recording => (
                    <div key={recording} className="flex justify-between items-center">
                      <div>הקלטה {recording}</div>
                      <button className="text-blue-600 hover:underline">
                        צפה בתמליל
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setSelectedClient(null)}
              >
                סגור
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                ערוך פרטים
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Client Form */}
      {showNewClientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">לקוח חדש</h3>
              <button 
                onClick={() => setShowNewClientForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">שם מלא</label>
                <input type="text" className="mt-1 block w-full rounded-md border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">טלפון</label>
                <input type="tel" className="mt-1 block w-full rounded-md border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">אימייל</label>
                <input type="email" className="mt-1 block w-full rounded-md border p-2" />
              </div>
            </form>

            <div className="mt-6 flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowNewClientForm(false)}
              >
                ביטול
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                שמור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;