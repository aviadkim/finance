import { sendTranscriptEmail } from './EmailService';

export class MeetingSummarizer {
  constructor(transcript) {
    this.transcript = transcript;
    this.topics = new Set();
    this.mainPoints = [];
    this.actionItems = [];
  }

  async analyze() {
    this.identifyTopics();
    this.extractMainPoints();
    this.findActionItems();
    await this.sendSummaryEmail();
    return this.generateSummary();
  }

  identifyTopics() {
    const topicKeywords = {
      'השקעות': ['השקעה', 'תיק השקעות', 'תשואה'],
      'פנסיה': ['פנסיה', 'קרן', 'חיסכון פנסיוני'],
      'ביטוח': ['ביטוח', 'פוליסה', 'כיסוי'],
      'תכנון פיננסי': ['תכנון', 'יעדים', 'תקציב']
    };

    this.transcript.forEach(entry => {
      Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        if (keywords.some(keyword => entry.text.includes(keyword))) {
          this.topics.add(topic);
        }
      });
    });
  }

  extractMainPoints() {
    const importantPhrases = [
      'חשוב לציין',
      'נקודה חשובה',
      'צריך לזכור',
      'ההמלצה שלי'
    ];

    this.transcript.forEach(entry => {
      importantPhrases.forEach(phrase => {
        if (entry.text.includes(phrase)) {
          this.mainPoints.push(entry.text);
        }
      });
    });
  }

  findActionItems() {
    const actionPhrases = [
      'צריך ל',
      'יש לטפל',
      'משימה',
      'לבדוק',
      'להעביר'
    ];

    this.transcript.forEach(entry => {
      actionPhrases.forEach(phrase => {
        if (entry.text.includes(phrase)) {
          this.actionItems.push(entry.text);
        }
      });
    });
  }

  generateSummary() {
    return {
      topics: Array.from(this.topics),
      mainPoints: this.mainPoints,
      actionItems: this.actionItems,
      summary: this.createTextSummary()
    };
  }

  createTextSummary() {
    return `
    סיכום פגישה
    ==========

    נושאים שנדונו:
    ${Array.from(this.topics).map(topic => `- ${topic}`).join('\n')}

    נקודות עיקריות:
    ${this.mainPoints.map(point => `- ${point}`).join('\n')}

    משימות להמשך:
    ${this.actionItems.map(item => `- ${item}`).join('\n')}
    `;
  }

  async sendSummaryEmail() {
    const summary = this.generateSummary();
    await sendTranscriptEmail(summary);
  }
}
