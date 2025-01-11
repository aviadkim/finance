import React, { useState, useEffect } from 'react';

const MeetingDetailsTracker = ({ transcript, duration }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    startTime: new Date(),
    sections: {
      introduction: { timeSpent: 0, required: 2 },
      riskDiscussion: { timeSpent: 0, required: 5 },
      investmentStrategy: { timeSpent: 0, required: 5 },
      clientQuestions: { timeSpent: 0, required: 3 },
      nextSteps: { timeSpent: 0, required: 2 }
    },
    keyPoints: [],
    actionItems: []
  });

  const [minutesSummary, setMinutesSummary] = useState([]);

  useEffect(() => {
    if (transcript) {
      analyzeTranscriptByTime(transcript);
    }
  }, [transcript]);

  const analyzeTranscriptByTime = (text) => {
    // Split transcript into 5-minute segments
    const wordsPerMinute = 150; // Average speaking rate
    const words = text.split(' ');
    const segments = [];
    let currentSegment = [];
    let currentMinute = 0;

    words.forEach((word, index) => {
      currentSegment.push(word);
      if (currentSegment.length >= wordsPerMinute) {
        segments.push({
          minute: currentMinute,
          text: currentSegment.join(' ')
        });
        currentSegment = [];
        currentMinute += 1;
      }
    });

    // Add remaining words
    if (currentSegment.length > 0) {
      segments.push({
        minute: currentMinute,
        text: currentSegment.join(' ')
      });
    }

    generateMinutesSummary(segments);
  };

  const generateMinutesSummary = (segments) => {
    const summary = segments.map(segment => {
      const topics = detectTopics(segment.text);
      return {
        minute: segment.minute,
        topics,
        warnings: checkRegulationRequirements(topics)
      };
    });

    setMinutesSummary(summary);
  };

  const detectTopics = (text) => {
    const topics = [];
    if (text.includes('סיכון') || text.includes('תנודתיות')) topics.push('דיון בסיכונים');
    if (text.includes('השקעה') || text.includes('תיק')) topics.push('אסטרטגיית השקעה');
    if (text.includes('שאלה') || text.includes('?')) topics.push('שאלות לקוח');
    // Add more topic detection logic
    return topics;
  };

  const checkRegulationRequirements = (topics) => {
    const warnings = [];
    const requiredTopics = ['דיון בסיכונים', 'אסטרטגיית השקעה'];
    requiredTopics.forEach(topic => {
      if (!topics.includes(topic)) {
        warnings.push(`חסר דיון ב${topic}`);
      }
    });
    return warnings;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">סיכום פגישה לפי דקות</h2>
      
      {/* Time Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">חלוקת זמנים</h3>
        <div className="space-y-2">
          {Object.entries(meetingDetails.sections).map(([section, data]) => (
            <div key={section} className="flex items-center">
              <div className="w-32 text-sm">{section}</div>
              <div className="flex-1 h-4 bg-gray-200 rounded">
                <div 
                  className={`h-full rounded ${
                    data.timeSpent >= data.required ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(data.timeSpent / duration) * 100}%` }}
                />
              </div>
              <div className="w-20 text-sm text-right">
                {data.timeSpent}/{data.required} דקות
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minute by Minute Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-2">סיכום לפי דקות</h3>
        {minutesSummary.map((segment, index) => (
          <div key={index} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <div className="font-medium">דקה {segment.minute + 1}</div>
              <div className="text-sm text-gray-600">
                {segment.topics.join(', ') || 'אין נושאים מזוהים'}
              </div>
            </div>
            {segment.warnings.length > 0 && (
              <div className="mt-1 text-sm text-red-600">
                {segment.warnings.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Items */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">משימות להמשך</h3>
        <ul className="list-disc list-inside space-y-1">
          {meetingDetails.actionItems.map((item, index) => (
            <li key={index} className="text-sm">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MeetingDetailsTracker;