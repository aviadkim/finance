class MeetingSummarizer {
  constructor(transcript) {
    this.transcript = transcript;
  }

  // Extract key topics
  extractKeyTopics() {
    const topicKeywords = {
      'השקעות': ['השקעה', 'תיק השקעות', 'פוליסה', 'תשואה'],
      'פיננסים': ['כספים', 'תקציב', 'חסכון', 'הלוואה'],
      'ביטוח': ['ביטוח', 'פוליסה', 'סיכון', 'כיסוי'],
      'פנסיה': ['פנסיה', 'פרישה', 'חיסכון פנסיוני']
    };

    const detectedTopics = Object.entries(topicKeywords).filter(([topic, keywords]) => 
      keywords.some(keyword => 
        this.transcript.some(entry => 
          entry.text.toLowerCase().includes(keyword)
        )
      )
    ).map(([topic]) => topic);

    return detectedTopics.length > 0 ? detectedTopics : ['כללי'];
  }

  // Identify main discussion points
  identifyMainDiscussionPoints() {
    // Look for sentences with key action indicators
    const actionIndicators = [
      'צריך לבדוק',
      'מתכנן',
      'רוצה להשקיע',
      'מעוניין',
      'חושב על',
      'מציע',
      'ממליץ'
    ];

    return this.transcript
      .filter(entry => 
        actionIndicators.some(indicator => 
          entry.text.toLowerCase().includes(indicator)
        )
      )
      .slice(0, 3)
      .map(entry => entry.text);
  }

  // Generate summary
  generateSummary() {
    const keyTopics = this.extractKeyTopics();
    const discussionPoints = this.identifyMainDiscussionPoints();

    // Basic summary structure
    return `
סיכום פגישה:

נושאים עיקריים:
${keyTopics.map(topic => `• ${topic}`).join('\n')}

עיקרי הדברים:
${discussionPoints.length > 0 
  ? discussionPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')
  : 'לא אותרו נקודות מרכזיות'}

המלצות ראשוניות:
• בחן את הנקודות שעלו בפגישה
• קבע מועד המשך בהקדם
• בדוק אפשרויות נוספות שעלו בשיחה
`;
  }
}

export default MeetingSummarizer;