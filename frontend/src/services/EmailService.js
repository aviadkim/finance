class EmailService {
  constructor() {
    this.senderEmail = 'info@movne.co.il';
  }

  async sendMeetingSummary({
    clientEmail,
    clientName,
    meetingDate,
    summary,
    questions,
    recommendations,
    nextMeeting
  }) {
    try {
      const emailContent = this.generateEmailTemplate({
        clientName,
        meetingDate,
        summary,
        questions,
        recommendations,
        nextMeeting
      });

      const emailData = {
        to: clientEmail,
        from: this.senderEmail,
        subject: `סיכום פגישה - ${meetingDate}`,
        html: emailContent
      };

      // This will be replaced with actual API call when backend is set up
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  generateEmailTemplate({
    clientName,
    meetingDate,
    summary,
    questions,
    recommendations,
    nextMeeting
  }) {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
          }
          .question {
            margin-bottom: 10px;
            padding-right: 15px;
            border-right: 3px solid #4299e1;
          }
          .recommendation {
            margin-bottom: 10px;
            padding-right: 15px;
            border-right: 3px solid #48bb78;
          }
          .next-meeting {
            background-color: #ebf8ff;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>סיכום פגישה</h2>
          <p>שלום ${clientName},</p>
          <p>להלן סיכום פגישתנו מתאריך ${meetingDate}</p>
        </div>

        <div class="section">
          <h3>סיכום הפגישה</h3>
          <p>${summary}</p>
        </div>

        <div class="section">
          <h3>נושאים שנדונו</h3>
          ${questions.map(q => `
            <div class="question">
              <p><strong>${q.question}</strong></p>
              <p>${q.answer}</p>
            </div>
          `).join('')}
        </div>

        ${recommendations.length > 0 ? `
          <div class="section">
            <h3>המלצות</h3>
            ${recommendations.map(r => `
              <div class="recommendation">
                <p>${r}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${nextMeeting ? `
          <div class="next-meeting">
            <h3>פגישה הבאה</h3>
            <p>נקבעה פגישה לתאריך: ${nextMeeting}</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p>בברכה,</p>
          <p>Movne Global</p>
          <small style="color: #718096;">הודעה זו נשלחה באופן אוטומטי לאחר פגישתנו</small>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();