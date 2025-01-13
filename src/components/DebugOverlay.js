import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';

const DebugOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('system');
  const [systemInfo, setSystemInfo] = useState({});

  useEffect(() => {
    console.log('Debug Overlay Mounted');
    console.log('Current Environment:', process.env.NODE_ENV);
    console.log('Auth Status:', auth.currentUser ? 'Logged In' : 'Not Logged In');
    
    // Update system info every 5 seconds
    const interval = setInterval(() => {
      updateSystemInfo();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateSystemInfo = () => {
    const info = {
      timestamp: new Date().toLocaleString(),
      user: auth.currentUser ? {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName
      } : 'Not logged in',
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio
      },
      routing: {
        pathname: window.location.pathname,
        hash: window.location.hash,
        search: window.location.search
      },
      components: {
        overlay: 'mounted',
        visible: isOpen
      }
    };

    setSystemInfo(info);
    console.log('System Info Updated:', info);
  };

  const renderDebugContent = () => {
    switch(activeTab) {
      case 'system':
        return (
          <pre style={{direction: 'ltr', textAlign: 'left'}}>
            {JSON.stringify(systemInfo, null, 2)}
          </pre>
        );
      case 'firebase':
        return (
          <div>
            <p>Firebase Configuration:</p>
            <pre style={{direction: 'ltr', textAlign: 'left'}}>
              {JSON.stringify({
                projectId: db?.app?.options?.projectId || 'Not configured',
                authDomain: db?.app?.options?.authDomain || 'Not configured',
                databaseURL: db?.app?.options?.databaseURL || 'Not configured'
              }, null, 2)}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        maxHeight: isOpen ? '500px' : '50px',
        overflow: 'auto',
        transition: 'max-height 0.3s ease'
      }}
    >
      <button 
        onClick={() => {
          console.log('Debug Toggle Clicked');
          setIsOpen(!isOpen);
        }}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '5px 10px',
          marginRight: '10px',
          border: '2px solid white'
        }}
      >
        {isOpen ? 'סגור דיבאג' : 'פתח דיבאג'}
      </button>

      {isOpen && (
        <>
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={() => setActiveTab('system')}
              style={{ 
                backgroundColor: activeTab === 'system' ? 'blue' : 'gray',
                color: 'white',
                padding: '5px 10px',
                margin: '0 5px'
              }}
            >
              מערכת
            </button>
            <button 
              onClick={() => setActiveTab('firebase')}
              style={{ 
                backgroundColor: activeTab === 'firebase' ? 'blue' : 'gray',
                color: 'white',
                padding: '5px 10px',
                margin: '0 5px'
              }}
            >
              Firebase
            </button>
          </div>

          <div style={{ 
            backgroundColor: 'black', 
            padding: '10px', 
            marginTop: '10px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {renderDebugContent()}
          </div>
        </>
      )}
    </div>
  );
};

export default DebugOverlay;