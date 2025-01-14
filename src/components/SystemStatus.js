import React, { useState, useEffect, useCallback } from 'react';
import { SystemDebugger } from '../utils/SystemDebugger';

const StatusList = ({ items }) => (
  <ul className="mt-4">
    {items.map((item, index) => (
      <li key={index} className={`text-${item.status === 'PASS' ? 'green' : 'red'}-500`}>
        {item.name}: {item.message}
      </li>
    ))}
  </ul>
);

const SystemStatus = () => {
  const [status, setStatus] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  const runChecks = useCallback(async () => {
    setIsChecking(true);
    try {
      const results = await SystemDebugger.runDiagnostics();
      setStatus(results);
    } catch (error) {
      console.error('Error running checks:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    runChecks();
    const interval = setInterval(runChecks, 300000); // every 5 minutes
    return () => clearInterval(interval);
  }, [runChecks]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">סטטוס מערכת</h2>
      {isChecking ? (
        <p>בודק מערכת...</p>
      ) : (
        <StatusList items={Object.entries(status).map(([name, { status, message }]) => ({
          name,
          status,
          message
        }))} />
      )}
    </div>
  );
};

export default SystemStatus;