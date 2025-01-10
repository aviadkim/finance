class MeetingTemplates {
  static templates = {
    default: {
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
    },
    followUp: {
      subject: 'Follow-up: Our Discussion on {date}',
      body: `Dear {clientName},

I wanted to follow up on our discussion from {date}. Here are the key points we covered:

Meeting Summary:
{summary}

Agreed Actions:
{actionItems}

Timeline:
{nextSteps}

Please let me know if you need any clarification or have questions about the next steps.

Best regards,
{advisorName}`
    },
    quarterly: {
      subject: 'Quarterly Review Meeting Summary - {date}',
      body: `Dear {clientName},

Thank you for participating in our quarterly review meeting on {date}. Below is a comprehensive summary of our discussion:

Portfolio Review:
{summary}

Recommended Actions:
{actionItems}

Next Quarter Planning:
{nextSteps}

Detailed Discussion:
{transcript}

Best regards,
{advisorName}`
    }
  };

  static generateEmailTemplate({ transcript, summary, template = 'default', metadata = {} }) {
    const selectedTemplate = this.templates[template];
    if (!selectedTemplate) {
      throw new Error(`Template '${template}' not found`);
    }

    const date = new Date().toLocaleDateString();
    const replacements = {
      date,
      clientName: metadata.clientName || '[Client Name]',
      advisorName: metadata.advisorName || '[Advisor Name]',
      summary: summary || '[Summary Not Available]',
      transcript: transcript || '[Transcript Not Available]',
      actionItems: metadata.actionItems?.join('\n') || '[No Action Items]',
      nextSteps: metadata.nextSteps || '[Next Steps Not Specified]'
    };

    let subject = selectedTemplate.subject;
    let body = selectedTemplate.body;

    // Replace all placeholders
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`\{${key}\}`, 'g');
      subject = subject.replace(regex, value);
      body = body.replace(regex, value);
    });

    return { subject, body };
  }
}

export { MeetingTemplates };