import React, { useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { getDocs, collection, query } from 'firebase/firestore';

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
  }, []);

  const handleClick = async () => {
    console.log('Test button clicked');
    try {
      const q = query(collection(db, 'clients'));
      const querySnapshot = await getDocs(q);
      console.log('Clients count:', querySnapshot.size);
      querySnapshot.forEach((doc) => {
        console.log('Client data:', doc.id, doc.data());
      });
    } catch (error) {
      console.error('Operation Error:', error.message);
      console.error('Full error:', error);
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
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      System Test
    </div>
  );
};

export default TestDeployment;