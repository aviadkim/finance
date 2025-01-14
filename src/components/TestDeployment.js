import React, { useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const TestDeployment = () => {
  useEffect(() => {
    console.log('Testing Firebase connection...');
    try {
      const projectId = db?.app?.options?.projectId;
      console.log('Firebase Project ID:', projectId);
      console.log('Auth Status:', auth.currentUser ? 'Logged In' : 'Not Logged In');
    } catch (error) {
      console.error('Firebase Error:', error);
    }

    console.log('TestDeployment component mounted');
  }, []);

  const handleClick = async () => {
    console.log('Test button clicked');
    try {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      console.log('Clients count:', querySnapshot.size);
      querySnapshot.forEach((doc) => {
        console.log('Client:', doc.id, doc.data());
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