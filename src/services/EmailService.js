class EmailService {
  static generateEmailContent({
    transcript,
    summary,
    clientName,
    advisorName,
    date = new Date().toLocaleDateString('he-IL'),
    language = 'he'
  }) {
    const templates = {
      he: {
        subject: `סיכום פגישה - ${date}`,
        body: `
${clientName} שלום,

תודה על פגישתנו שהתקיימה בתאריך ${date}.

נקודות עיקריות:
${summary}

תמליל מלא:
${transcript}

בברכה,
${advisorName}
        `
      },
      en: {
        subject: `Meeting Summary - ${date}`,
        body: `
Dear ${clientName},

Thank you for our meeting on ${date}.

Key Points:
${summary}

Full Transcript:
${transcript}

Best regards,
${advisorName}
        `
      }
    };

    const template = templates[language];
    return {
      subject: template.subject,
      body: template.body.trim()
    };
  }

  static async sendEmail({ to, subject, body }) {
    try {
      // Using SendGrid for email delivery
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: to }]
          }],
          from: { email: 'noreply@movne.co.il' },
          subject: subject,
          content: [{
            type: 'text/plain',
            value: body
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }
}

export default EmailService;