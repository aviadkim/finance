import React, { useState, useEffect } from 'react';

const RegulatoryTracker = ({ transcript, meetingDuration }) => {
  const [regulatoryChecklist, setRegulatoryChecklist] = useState({
    riskDiscussion: {
      covered: false,
      timeSpent: 0,
      required: true,
      minimumTime: 5, // minutes
      topics: ['הבנת סיכון', 'תיאבון סיכון', 'תרחישי קיצון']
    },
    investmentChanges: {
      covered: false,
      timeSpent: 0,
      required: true,
      minimumTime: 3,
      topics: ['שינויי השקעה', 'עדכון מדיניות']
    },
    clientNeeds: {
      covered: false,
      timeSpent: 0,
      required: true,
      minimumTime: 5,
      topics: ['צרכי נזילות', 'מטרות השקעה', 'אופק זמן']
    },
    conflicts: {
      covered: false,
      timeSpent: 0,
      required: true,
      minimumTime: 2,
      topics: ['ניגודי עניינים', 'גילוי נאות']
    }
  });

  const [missingItems, setMissingItems] = useState([]);
  const [warningLevel, setWarningLevel] = useState('none'); // none, warning, critical

  useEffect(() => {
    if (transcript) {
      analyzeTranscript(transcript);
    }
  }, [transcript]);

  const analyzeTranscript = (text) => {
    // Check each regulatory requirement
    const newChecklist = { ...regulatoryChecklist };
    
    Object.keys(newChecklist).forEach(key => {
      const item = newChecklist[key];
      let covered = false;
      let timeSpent = 0;

      // Check if topics are covered in transcript
      item.topics.forEach(topic => {
        if (text.includes(topic)) {
          covered = true;
          // Estimate time spent based on word count around topic
          const surroundingText = text.substring(
            Math.max(0, text.indexOf(topic) - 100),
            Math.min(text.length, text.indexOf(topic) + 100)
          );
          timeSpent += surroundingText.split(' ').length / 150; // Rough estimate: 150 words per minute
        }
      });

      newChecklist[key].covered = covered;
      newChecklist[key].timeSpent = timeSpent;
    });

    setRegulatoryChecklist(newChecklist);
    checkMissingItems(newChecklist);
  };

  const checkMissingItems = (checklist) => {
    const missing = [];
    let criticalMissing = 0;

    Object.entries(checklist).forEach(([key, item]) => {
      if (item.required) {
        if (!item.covered) {
          missing.push(`נושא חסר: ${key}`);
          criticalMissing++;
        } else if (item.timeSpent < item.minimumTime) {
          missing.push(`זמן דיון קצר מדי ב: ${key} (${Math.round(item.timeSpent)} דקות מתוך ${item.minimumTime} נדרשות)`);
        }
      }
    });

    setMissingItems(missing);
    setWarningLevel(criticalMissing > 0 ? 'critical' : missing.length > 0 ? 'warning' : 'none');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">מעקב רגולטורי</h2>
      
      {/* Status Overview */}
      <div className="mb-4">
        <div className={`rounded-lg p-3 ${
          warningLevel === 'critical' ? 'bg-red-100 text-red-800' :
          warningLevel === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          <div className="font-medium">סטטוס פגישה: {
            warningLevel === 'critical' ? 'חסרים נושאים קריטיים' :
            warningLevel === 'warning' ? 'נדרשת השלמה' :
            'תקין'
          }</div>
          <div className="text-sm mt-1">משך פגישה: {Math.round(meetingDuration)} דקות</div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-4">
        {Object.entries(regulatoryChecklist).map(([key, item]) => (
          <div key={key} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <div className="font-medium">{key}</div>
              <div className={`px-2 py-1 rounded ${
                item.covered && item.timeSpent >= item.minimumTime
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {Math.round(item.timeSpent)} דקות
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              נושאים לכיסוי: {item.topics.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* Missing Items */}
      {missingItems.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-red-600">נושאים להשלמה:</h3>
          <ul className="mt-2 space-y-1">
            {missingItems.map((item, index) => (
              <li key={index} className="text-sm text-red-600">• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RegulatoryTracker;