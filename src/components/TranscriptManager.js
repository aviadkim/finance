import React, { useState } from 'react';

const TranscriptManager = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);

  return (
    <div>
      <div className="min-h-[200px] bg-gray-50 rounded-lg p-4 text-right">
        {isTranscribing ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">מתמלל...</p>
          </div>
        ) : (
          <p className="text-gray-500">התמלול יופיע כאן...</p>
        )}
      </div>
    </div>
  );
};

export default TranscriptManager;