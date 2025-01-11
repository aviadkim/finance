import React, { useState, useEffect } from 'react';

const UsageTracker = () => {
  const [usage, setUsage] = useState({
    transcriptionMinutes: 0,
    aiAnalyses: 0,
    estimatedCosts: {
      whisper: 0,  // $0.006 per minute
      gpt4: 0      // $0.03 per analysis
    },
    freeUsage: {
      webSpeechApi: 0,
      manualGpt: 0
    }
  });

  const updateUsage = (type, amount) => {
    setUsage(prev => ({
      ...prev,
      [type]: prev[type] + amount,
      estimatedCosts: {
        whisper: type === 'transcriptionMinutes' ? prev.estimatedCosts.whisper + (amount * 0.006) : prev.estimatedCosts.whisper,
        gpt4: type === 'aiAnalyses' ? prev.estimatedCosts.gpt4 + (amount * 0.03) : prev.estimatedCosts.gpt4
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h3 className="text-lg font-semibold mb-3">ניטור שימוש במערכת</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">שימוש בכלים בתשלום:</h4>
          <ul className="mt-2 space-y-2">
            <li>דקות תמלול: {usage.transcriptionMinutes}</li>
            <li>ניתוחי AI: {usage.aiAnalyses}</li>
            <li className="font-semibold">עלות מוערכת: ${(usage.estimatedCosts.whisper + usage.estimatedCosts.gpt4).toFixed(2)}</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium">שימוש בכלים חינמיים:</h4>
          <ul className="mt-2 space-y-2">
            <li>תמלול בדפדפן: {usage.freeUsage.webSpeechApi} דקות</li>
            <li>ניתוחים ידניים: {usage.freeUsage.manualGpt}</li>
            <li className="font-semibold text-green-600">חיסכון מוערך: ${((usage.freeUsage.webSpeechApi * 0.006) + (usage.freeUsage.manualGpt * 0.03)).toFixed(2)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsageTracker;