// Email generator with Hebrew support
class EmailGenerator {
  static templates = {
    meetingSummary: {
      he: {
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
      en: {
        subject: 'Meeting Summary - {date}',
        body: `Dear {clientName},

Thank you for our meeting on {date}. Here's a summary of our discussion:

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
    }
  };

  static generateEmail(templateName, language, data) {
    const template = this.templates[templateName][language];
    if (!template) {
      throw new Error(`Template ${templateName} not found for language ${language}`);
    }

    let subject = template.subject;
    let body = template.body;

    // Replace placeholders
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      subject = subject.replace(placeholder, value);
      body = body.replace(placeholder, value);
    });

    return { subject, body };
  }
}

export default EmailGenerator;