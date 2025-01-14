import React, { useEffect } from 'react';
import { db, auth } from '../firebaseConfig';

const TestDeployment = () => {
  useEffect(() => {
    // Test Firebase connection
    console.log('Testing Firebase connection...');
    try {
      const projectId = db?.app?.options?.projectId;
      console.log('Firebase Project ID:', projectId);
      console.log('Auth Status:', auth.currentUser ? 'Logged In' : 'Not Logged In');
    } catch (error) {
      console.error('Firebase Error:', error);
    }

    // Test component rendering
    console.log('TestDeployment component mounted');
  }, []);

  const handleClick = () => {
    console.log('Test button clicked');
    try {
      // Test client collection access
      db.collection('clients').get()
        .then(snapshot => {
          console.log('Clients count:', snapshot.size);
        })
        .catch(error => {
          console.error('Firestore Error:', error);
        });
    } catch (error) {
      console.error('Operation Error:', error);
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#ff0000',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        zIndex: 9999,
        cursor: 'pointer'
      }}
    >
      System Test
    </div>
  );
};

export default TestDeployment;