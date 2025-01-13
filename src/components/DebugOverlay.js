import React, { useState, useEffect } from 'react';

// Basic version without Firebase dependencies
const DebugOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Basic logging
    console.log('Basic Debug Overlay Mounted');
    console.log('Window Size:', window.innerWidth, 'x', window.innerHeight);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
        backgroundColor: 'red',
        color: 'white',
        padding: '10px'
      }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '5px 10px',
          marginRight: '10px',
          border: '2px solid white'
        }}
      >
        Debug Test Button
      </button>
      
      {isOpen && (
        <div style={{
          backgroundColor: 'black',
          padding: '10px',
          marginTop: '10px'
        }}>
          <pre>
            {JSON.stringify({
              timestamp: new Date().toLocaleString(),
              screen: {
                width: window.innerWidth,
                height: window.innerHeight
              },
              url: window.location.href
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugOverlay;