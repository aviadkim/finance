import React, { useState, useEffect } from 'react';

function RegulatoryTracking() {
  const [clients, setClients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Regulatory deadlines and requirements
  const regulatoryRequirements = {
    ANNUAL_REVIEW: {
      period: 365,
      name: 'עדכון צרכים שנתי',
      required: true,
      questions: [
        'האם חל שינוי במצב המשפחתי?',
        'האם חל שינוי בהעדפות השקעה?',
        'האם חל שינוי במטרות הפיננסיות?',
        'האם נדרש עדכון בפרופיל סיכון?'
      ]
    },
    QUARTERLY_REVIEW: {
      period: 90,
      name: 'בדיקה רבעונית',
      required: true,
      questions: [
        'האם התיק תואם את מדיניות ההשקעה?',
        'האם נדרש איזון מחדש?',
        'האם יש חריגות רגולטוריות?'
      ]
    },
    RISK_ASSESSMENT: {
      period: 180,
      name: 'הערכת סיכונים',
      required: true,
      questions: [
        'האם חל שינוי בסיבולת לסיכון?',
        'האם נדרש עדכון בהקצאת נכסים?',
        'האם התיק תואם את פרופיל הסיכון?'
      ]
    }
  };

  const checkCompliance = (client) => {
    const today = new Date();
    const alerts = [];

    // Check each regulatory requirement
    Object.entries(regulatoryRequirements).forEach(([type, requirement]) => {
      const lastReview = new Date(client.lastReviews?.[type] || 0);
      const daysSinceReview = Math.floor((today - lastReview) / (1000 * 60 * 60 * 24));
      
      if (daysSinceReview >= requirement.period) {
        alerts.push({
          clientId: client.id,
          clientName: client.name,
          type,
          daysOverdue: daysSinceReview - requirement.period,
          requirement: requirement.name
        });
      }
    });

    return alerts;
  };

  useEffect(() => {
    // This would normally fetch from your backend
    const mockClients = [
      {
        id: '001',
        name: 'ישראל ישראלי',
        lastReviews: {
          ANNUAL_REVIEW: '2023-01-15',
          QUARTERLY_REVIEW: '2023-10-01',
          RISK_ASSESSMENT: '2023-06-15'
        }
      },
      // Add more mock clients
    ];

    setClients(mockClients);

    // Check compliance for all clients
    const allAlerts = mockClients.flatMap(checkCompliance);
    setAlerts(allAlerts);
  }, []);

  return (
    <div className="regulatory-tracking">
      <h2>מעקב רגולטורי</h2>
      
      <div className="alerts-section">
        <h3>התראות דחופות</h3>
        {alerts.map((alert, index) => (
          <div key={index} className="alert-card">
            <div className="alert-header">
              <span className="client-name">{alert.clientName}</span>
              <span className="alert-type">{alert.requirement}</span>
            </div>
            <div className="alert-body">
              <p>ימים באיחור: {alert.daysOverdue}</p>
              <button className="schedule-review-btn">
                קבע פגישת סקירה
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="compliance-checklist">
        <h3>בדיקות נדרשות</h3>
        {clients.map(client => (
          <div key={client.id} className="client-compliance">
            <h4>{client.name}</h4>
            {Object.entries(regulatoryRequirements).map(([type, requirement]) => (
              <div key={type} className="requirement-check">
                <h5>{requirement.name}</h5>
                <div className="questions-list">
                  {requirement.questions.map((question, index) => (
                    <div key={index} className="question-item">
                      <input type="checkbox" id={`${client.id}-${type}-${index}`} />
                      <label htmlFor={`${client.id}-${type}-${index}`}>{question}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegulatoryTracking;