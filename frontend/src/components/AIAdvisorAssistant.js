import React, { useState, useEffect } from 'react';

function AIAdvisorAssistant({ conversation, clientHistory }) {
  const [aiSuggestions, setAiSuggestions] = useState({
    nextQuestions: [],
    missingRequirements: [],
    insights: [],
    recommendations: []
  });

  const [recentContext, setRecentContext] = useState('');

  // Listen to conversation in real-time
  useEffect(() => {
    if (!conversation.latestTranscript) return;

    // Update recent context
    setRecentContext(conversation.latestTranscript);

    // Analyze with AI (will be connected to ChatGPT API)
    analyzeConversation(conversation.latestTranscript);
  }, [conversation.latestTranscript]);

  const analyzeConversation = async (transcript) => {
    // This will be replaced with actual ChatGPT API call
    const mockAIResponse = {
      nextQuestions: [
        {
          text: 'האם יש צורך בנזילות בשנה הקרובה?',
          context: 'הלקוח הזכיר שינויים במצב המשפחתי',
          priority: 'high'
        },
        {
          text: 'האם חלו שינויים במטרות ההשקעה?',
          context: 'דיון על שינויים בתיק',
          priority: 'medium'
        }
      ],
      missingRequirements: [
        'טרם בוצע גילוי נאות',
        'נדרש תיעוד לשינוי מדיניות'
      ],
      insights: [
        {
          text: 'הלקוח מבטא חשש מסיכון',
          source: 'ניתוח רגשי של השיחה'
        }
      ],
      recommendations: [
        {
          text: 'מומלץ לבצע הערכת סיכון מחדש',
          reason: 'שינוי בנסיבות הלקוח'
        }
      ]
    };

    setAiSuggestions(mockAIResponse);
  };

  return (
    <div className="ai-advisor-assistant">
      <div className="live-suggestions">
        <h3>עוזר חכם ליועץ</h3>
        
        {/* Next Questions */}
        <div className="suggestion-section">
          <h4>שאלות מומלצות</h4>
          {aiSuggestions.nextQuestions.map((q, i) => (
            <div key={i} className={`question-suggestion ${q.priority}`}>
              <p>{q.text}</p>
              <small>{q.context}</small>
            </div>
          ))}
        </div>

        {/* Missing Requirements */}
        {aiSuggestions.missingRequirements.length > 0 && (
          <div className="suggestion-section warning">
            <h4>דרישות חסרות</h4>
            <ul>
              {aiSuggestions.missingRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Insights */}
        <div className="suggestion-section">
          <h4>תובנות מהשיחה</h4>
          {aiSuggestions.insights.map((insight, i) => (
            <div key={i} className="insight">
              <p>{insight.text}</p>
              <small>{insight.source}</small>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="suggestion-section">
          <h4>המלצות</h4>
          {aiSuggestions.recommendations.map((rec, i) => (
            <div key={i} className="recommendation">
              <p>{rec.text}</p>
              <small>{rec.reason}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Debug Panel */}
      <div className="debug-panel">
        <h4>מידע לבדיקה</h4>
        <div>
          <h5>הקשר נוכחי:</h5>
          <pre>{recentContext}</pre>
          <h5>הצעות AI:</h5>
          <pre>{JSON.stringify(aiSuggestions, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default AIAdvisorAssistant;