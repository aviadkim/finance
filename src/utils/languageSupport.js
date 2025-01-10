// Language support utilities
export const setupHebrewRecognition = (recognition) => {
  recognition.lang = 'he-IL';
  recognition.continuous = true;
  recognition.interimResults = true;
  return recognition;
};

export const hebrewEmailTemplates = {
  meetingSummary: {
    subject: 'סיכום פגישה - {date}',
    body: `שלום {clientName},

תודה על פגישתנו מיום {date}. להלן סיכום הדברים שעלו בפגישה:

נקודות עיקריות:
{summary}

משימות לביצוע:
{actionItems}

צעדים הבאים:
{nextSteps}

תמליל מלא:
{transcript}

בברכה,
{advisorName}`
  },
  portfolioReview: {
    subject: 'סקירת תיק השקעות - {date}',
    body: `שלום {clientName},

בהמשך לפגישתנו בנושא סקירת תיק ההשקעות מיום {date}, להלן סיכום הדברים:

מצב תיק ההשקעות:
{summary}

שינויים מומלצים:
{actionItems}

הערכת סיכונים:
- פרופיל סיכון נוכחי: {riskProfile}
- שינויים מוצעים: {proposedChanges}

פגישת מעקב הבאה: {nextDate}

בברכה,
{advisorName}`
  }
};
