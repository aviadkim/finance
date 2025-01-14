import React, { useState, useEffect } from 'react';
import { SystemDebugger } from '../utils/SystemDebugger';

const RegulatoryFramework = () => {
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processTranscript = async () => {
      if (transcript) {
        setIsProcessing(true);
        try {
          const results = await SystemDebugger.runDiagnostics();
          console.log('Diagnostics results:', results);
        } catch (error) {
          console.error('Error running diagnostics:', error);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    processTranscript();
  }, [transcript]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">מסגרת רגולטורית</h2>
      {isProcessing && <div>מעבד...</div>}
      <div className="mt-4">
        <pre className="whitespace-pre-wrap">{transcript}</pre>
      </div>
    </div>
  );
};

export default RegulatoryFramework;