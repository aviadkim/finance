import React from 'react';

const TestDeployment = () => {
  console.log('TestDeployment component rendered');
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#ff0000',
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      zIndex: 9999
    }}>
      Deployment Test
    </div>
  );
};

export default TestDeployment;