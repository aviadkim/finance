class ClientDatabase {
  constructor() {
    this.dbName = 'clientDB';
    this.storeName = 'clients';
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        
        // Create indexes
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('email', 'email', { unique: true });
        store.createIndex('lastContact', 'lastContact', { unique: false });
      };
    });
  }

  async addClient(clientData) {
    const db = await this.initialize();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.add({
        ...clientData,
        createdAt: new Date(),
        lastContact: new Date()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllClients() {
    const db = await this.initialize();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateClient(id, updates) {
    const db = await this.initialize();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.get(id);
      request.onsuccess = () => {
        const client = request.result;
        const updatedClient = { ...client, ...updates, lastModified: new Date() };
        const updateRequest = store.put(updatedClient);
        
        updateRequest.onsuccess = () => resolve(updateRequest.result);
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export default new ClientDatabase();