import React, { useState, useEffect } from 'react';
import { runSystemCheck } from '../tests/SystemCheck';

const SystemStatus = () => {
  const [status, setStatus] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Run check every 30 minutes
  useEffect(() => {
    const checkSystem = async () => {
      if (!isChecking) {
        setIsChecking(true);
        const results = await runSystemCheck();
        setStatus(results);
        setLastCheck(new Date());
        setIsChecking(false);
      }
    };

    checkSystem();
    const interval = setInterval(checkSystem, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleManualCheck = async () => {
    if (!isChecking) {
      setIsChecking(true);
      const results = await runSystemCheck();
      setStatus(results);
      setLastCheck(new Date());
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">סטטוס מערכת</h3>
          <button
            onClick={handleManualCheck}
            disabled={isChecking}
            className={`px-3 py-1 rounded ${isChecking ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {isChecking ? 'בודק...' : 'בדוק עכשיו'}
          </button>
        </div>

        {status && (
          <div className="space-y-2">
            <div className={`text-sm ${status.allPassed ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {status.summary}
            </div>

            <div className="space-y-1">
              {status.results.map((result, index) => (
                <div 
                  key={index}
                  className={`flex justify-between items-center p-2 rounded ${result.status === 'PASS' ? 'bg-green-50' : 'bg-red-50'}`}
                >
                  <span>{result.name}</span>
                  <span className={result.status === 'PASS' ? 'text-green-600' : 'text-red-600'}>
                    {result.status}
                  </span>
                  {result.error && (
                    <span className="text-xs text-red-500 block mt-1">{result.error}</span>
                  )}
                </div>
              ))}
            </div>

            {lastCheck && (
              <div className="text-xs text-gray-500 mt-2">
                בדיקה אחרונה: {lastCheck.toLocaleString('he-IL')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatus;