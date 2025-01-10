class EmailGenerator {
  static templates = {
    meetingSummary: {
      he: {
        subject: 'סיכום פגישה - {date}',
        body: `שלום {clientName},

תודה על פגישתנו ב-{date}. להלן סיכום הפגישה:

נקודות עיקריות:
{summary}

משימות להמשך:
{actionItems}

צעדים הבאים:
{nextSteps}

תמליל מלא:
{transcript}

בברכה,
{advisorName}`
      },
      en: {
        subject: 'Meeting Summary - {date}',
        body: `Dear {clientName},

Thank you for our meeting on {date}. Here's a summary:

Key Points:
{summary}

Action Items:
{actionItems}

Next Steps:
{nextSteps}

Full Transcript:
{transcript}

Best regards,
{advisorName}`
      }
    },
    portfolioReview: {
      he: {
        subject: 'סיכום סקירת תיק השקעות - {date}',
        body: `שלום {clientName},

תודה על פגישת סקירת התיק שהתקיימה ב-{date}.

סקירת מצב נוכחי:
{summary}

המלצות:
{actionItems}

שינויים מוצעים בתיק:
{nextSteps}

בברכה,
{advisorName}`
      }
    }
  };

  static generateEmail({ transcript, summary, template = 'meetingSummary', language = 'he', metadata = {} }) {
    console.log('Generating email with template:', template, 'language:', language);
    
    const selectedTemplate = this.templates[template]?.[language];
    if (!selectedTemplate) {
      console.error('Template not found:', template, language);
      throw new Error(`Template '${template}' not found for language '${language}'`);
    }

    const date = new Date().toLocaleDateString('he-IL');
    const replacements = {
      date,
      clientName: metadata.clientName || '[שם הלקוח]',
      advisorName: metadata.advisorName || '[שם היועץ]',
      summary: summary || '[תקציר לא זמין]',
      transcript: transcript || '[תמליל לא זמין]',
      actionItems: Array.isArray(metadata.actionItems) 
        ? metadata.actionItems.join('\n') 
        : '[אין משימות]',
      nextSteps: metadata.nextSteps || '[לא הוגדרו צעדים הבאים]'
    };

    console.log('Generating email with replacements:', replacements);

    let emailSubject = selectedTemplate.subject;
    let emailBody = selectedTemplate.body;

    // Replace all placeholders
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`\{${key}\}`, 'g');
      emailSubject = emailSubject.replace(regex, value);
      emailBody = emailBody.replace(regex, value);
    });

    return { subject: emailSubject, body: emailBody };
  }
}

export default EmailGenerator;