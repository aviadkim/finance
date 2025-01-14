import React, { useEffect, useCallback } from 'react';
import { SystemDebugger } from '../utils/SystemDebugger';

const SystemStatus = () => {
  const [status, setStatus] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  const runChecks = useCallback(async () => {
    setIsChecking(true);
    try {
      const results = await SystemDebugger.runAllChecks();
      setStatus(results);
    } catch (error) {
      console.error('Error running checks:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Run checks initially
    runChecks();

    // Set up interval for periodic checks
    const interval = setInterval(runChecks, 300000); // every 5 minutes

    return () => clearInterval(interval);
  }, [runChecks]); // Added runChecks to dependencies

  return (
    <div className="p-4">
      <h2>סטטוס מערכת</h2>
      <div className="mt-4">
        {isChecking ? (
          <p>בודק מערכת...</p>
        ) : (
          <StatusList status={status} />
        )}
      </div>
    </div>
  );
};

export default SystemStatus;