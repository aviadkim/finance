import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';

const DebugOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('system');
  const [systemInfo, setSystemInfo] = useState({});
  const [componentStates, setComponentStates] = useState({});

  // Collect system information
  const collectSystemInfo = () => {
    return {
      user: auth.currentUser ? {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName
      } : 'Not logged in',
      timestamp: new Date().toLocaleString(),
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
      }
    };
  };

  // Update system and component information
  useEffect(() => {
    setSystemInfo(collectSystemInfo());
  }, []);

  // Render debug information
  const renderDebugContent = () => {
    switch(activeTab) {
      case 'system':
        return (
          <pre style={{direction: 'ltr', textAlign: 'left'}}>
            {JSON.stringify(systemInfo, null, 2)}
          </pre>
        );
      case 'components':
        return (
          <pre style={{direction: 'ltr', textAlign: 'left'}}>
            {JSON.stringify(componentStates, null, 2)}
          </pre>
        );
      case 'firebase':
        return (
          <div>
            <p>Firebase Configuration:</p>
            <pre style={{direction: 'ltr', textAlign: 'left'}}>
              {JSON.stringify({
                projectId: db.app.options.projectId,
                apiKey: db.app.options.apiKey?.substring(0, 10) + '...',
                authDomain: db.app.options.authDomain
              }, null, 2)}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  // If not in development mode, don't render
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        maxHeight: isOpen ? '500px' : '50px',
        overflow: 'auto',
        transition: 'max-height 0.3s ease'
      }}
    >
      {/* Debug Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '5px 10px',
          marginRight: '10px'
        }}
      >
        {isOpen ? 'סגור דיבאג' : 'פתח דיבאג'}
      </button>

      {/* Tab Navigation */}
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
          onClick={() => setActiveTab('components')}
          style={{ 
            backgroundColor: activeTab === 'components' ? 'blue' : 'gray',
            color: 'white',
            padding: '5px 10px',
            margin: '0 5px'
          }}
        >
          רכיבים
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

      {/* Debug Content */}
      {isOpen && (
        <div style={{ 
          backgroundColor: 'black', 
          padding: '10px', 
          marginTop: '10px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          {renderDebugContent()}
        </div>
      )}
    </div>
  );
};

export default DebugOverlay;