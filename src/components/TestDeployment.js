import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const TestDeployment = () => {
  const [status, setStatus] = useState('Testing deployment...');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Firestore connection
        const querySnapshot = await getDocs(collection(db, 'test'));
        console.log('Firebase connection successful');
        setStatus('✅ Deployment successful! Firebase connection working.');
      } catch (error) {
        console.error('Firebase test error:', error);
        setStatus(`❌ Firebase connection failed: ${error.message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Deployment Test</h2>
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded">
          <h3 className="font-semibold">Environment Variables:</h3>
          <pre className="mt-2 text-sm">
            {JSON.stringify({
              FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'finance-5039e',
              AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'finance-5039e.firebaseapp.com',
            }, null, 2)}
          </pre>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <h3 className="font-semibold">Status:</h3>
          <p className="mt-2">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default TestDeployment;