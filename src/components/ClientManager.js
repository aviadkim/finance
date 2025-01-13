import React, { useState } from 'react';

// Mock data structure for a client
const initialClients = [
  {
    id: '1',
    firstName: 'ישראל',
    lastName: 'ישראלי',
    phone: '050-1234567',
    email: 'israel@email.com',
    birthDate: '1980-05-15',
    address: 'תל אביב, רחוב הירקון 123',
    notes: [],
    meetings: [
      { 
        date: '2024-01-15', 
        duration: '45:20', 
        recordingId: 'rec001',
        summary: 'דיון על תכנית השקעה שנתית'
      }
    ]
  },
  {
    id: '2',
    firstName: 'שרה',
    lastName: 'כהן',
    phone: '052-7654321',
    email: 'sarah@email.com',
    birthDate: '1975-11-20',
    address: 'ירושלים, רחוב יפו 456',
    notes: [],
    meetings: [
      { 
        date: '2024-01-10', 
        duration: '32:10', 
        recordingId: 'rec002',
        summary: 'בחינת אסטרטגיית השקעה'
      }
    ]
  }
];

const ClientManager = () => {
  const [clients, setClients] = useState(initialClients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);

  // Add new client
  const addClient = (newClient) => {
    const clientWithId = {
      ...newClient,
      id: String(Date.now()),
      meetings: [],
      notes: []
    };
    setClients([...clients, clientWithId]);
    setIsModalOpen(false);
    setIsNewClient(false);
    setSelectedClient(null);
  };

  // Update existing client
  const updateClient = (updatedClient) => {
    setClients(clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ));
    setSelectedClient(null);
    setIsModalOpen(false);
    setIsNewClient(false);
  };

  // Open modal for new client
  const handleAddNewClient = () => {
    setSelectedClient(null);
    setIsNewClient(true);
    setIsModalOpen(true);
  };

  // Filter and search clients
  const filteredClients = clients.filter(client => {
    const searchMatch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchMatch;
  });

  // Render client details modal
  const renderClientModal = () => {
    if (!isModalOpen) return null;

    const client = selectedClient || {};

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">
            {selectedClient ? 'עדכון פרטי לקוח' : 'לקוח חדש'}
          </h2>
          
          <form 
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newClient = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                birthDate: formData.get('birthDate'),
                address: formData.get('address')
              };

              if (selectedClient) {
                // Update existing client
                updateClient({...selectedClient, ...newClient});
              } else {
                // Add new client
                addClient(newClient);
              }
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">שם פרטי</label>
                <input
                  name="firstName"
                  type="text"
                  defaultValue={client.firstName || ''}
                  className="w-full p-2 border rounded"
                  placeholder="שם פרטי"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">שם משפחה</label>
                <input
                  name="lastName"
                  type="text"
                  defaultValue={client.lastName || ''}
                  className="w-full p-2 border rounded"
                  placeholder="שם משפחה"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">טלפון</label>
              <input
                name="phone"
                type="tel"
                defaultValue={client.phone || ''}
                className="w-full p-2 border rounded"
                placeholder="מספר טלפון"
                required
              />
            </div>

            <div>
              <label className="block mb-2">אימייל</label>
              <input
                name="email"
                type="email"
                defaultValue={client.email || ''}
                className="w-full p-2 border rounded"
                placeholder="כתובת אימייל"
                required
              />
            </div>

            <div>
              <label className="block mb-2">תאריך לידה</label>
              <input
                name="birthDate"
                type="date"
                defaultValue={client.birthDate || ''}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">כתובת</label>
              <input
                name="address"
                type="text"
                defaultValue={client.address || ''}
                className="w-full p-2 border rounded"
                placeholder="כתובת מלאה"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedClient(null);
                  setIsModalOpen(false);
                  setIsNewClient(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                ביטול
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                שמירה
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render client list
  const renderClientList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="חיפוש לקוחות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg pr-10"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
          <button
            onClick={handleAddNewClient}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + לקוח חדש
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => (
            <div 
              key={client.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedClient(client);
                setIsModalOpen(true);
                setIsNewClient(false);
              }}
            >
              <div className="font-medium">{`${client.firstName} ${client.lastName}`}</div>
              <div className="text-sm text-gray-600">{client.phone}</div>
              <div className="text-sm text-gray-600">{client.email}</div>
              <div className="mt-2 text-sm">
                <span className="text-blue-600">
                  {client.meetings?.length || 0} הקלטות
                </span>
                <span className="mx-2">•</span>
                <span>
                  פגישה אחרונה: {client.meetings?.[client.meetings.length - 1]?.date || 'אין'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderClientList()}
      
      {/* Client Details Modal */}
      {renderClientModal()}
    </div>
  );
};

export default ClientManager;