class TranscriptionService {
  constructor() {
    this.recognition = null;
    this.currentSpeaker = 'advisor'; // Default speaker
    this.transcript = [];
    this.lastSpeechTimestamp = 0;
    this.silenceThreshold = 1000; // 1 second of silence to switch speakers
  }

  initialize() {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.setupRecognition();
      return true;
    }
    return false;
  }

  setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'he-IL';

    // Detect silence to guess speaker changes
    this.recognition.onspeechend = () => {
      const now = Date.now();
      if (now - this.lastSpeechTimestamp > this.silenceThreshold) {
        this.currentSpeaker = this.currentSpeaker === 'advisor' ? 'client' : 'advisor';
      }
    };

    // Process speech results
    this.recognition.onresult = (event) => {
      const lastResult = Array.from(event.results).pop();
      if (lastResult.isFinal) {
        this.transcript.push({
          speaker: this.currentSpeaker,
          text: lastResult[0].transcript,
          timestamp: new Date().toISOString(),
          confidence: lastResult[0].confidence
        });
        this.lastSpeechTimestamp = Date.now();
      }
    };
  }

  generateSummary() {
    const summary = {
      date: new Date().toLocaleDateString('he-IL'),
      duration: this.calculateDuration(),
      mainPoints: this.extractMainPoints(),
      regulatoryChecks: this.checkRegulatoryRequirements(),
      followUpItems: this.extractFollowUpItems()
    };

    return this.formatSummaryEmail(summary);
  }

  extractMainPoints() {
    const mainPoints = [];
    const keyPhrases = [
      'מטרות השקעה',
      'רמת סיכון',
      'אופק השקעה',
      'צרכי נזילות',
      'שינוי מדיניות'
    ];

    this.transcript.forEach(entry => {
      keyPhrases.forEach(phrase => {
        if (entry.text.includes(phrase)) {
          mainPoints.push({
            topic: phrase,
            speaker: entry.speaker,
            text: entry.text
          });
        }
      });
    });

    return mainPoints;
  }

  checkRegulatoryRequirements() {
    const requirements = {
      riskDiscussion: false,
      investmentObjectives: false,
      clientNeeds: false,
      conflictOfInterest: false
    };

    this.transcript.forEach(entry => {
      if (entry.text.includes('סיכון')) requirements.riskDiscussion = true;
      if (entry.text.includes('מטרות')) requirements.investmentObjectives = true;
      if (entry.text.includes('צרכים')) requirements.clientNeeds = true;
      if (entry.text.includes('ניגוד עניינים')) requirements.conflictOfInterest = true;
    });

    return requirements;
  }

  extractFollowUpItems() {
    const followUp = [];
    const followUpPhrases = [
      'צריך לשלוח',
      'נדרש להשלים',
      'לבדוק',
      'להעביר',
      'לעדכן'
    ];

    this.transcript.forEach(entry => {
      followUpPhrases.forEach(phrase => {
        if (entry.text.includes(phrase)) {
          followUp.push({
            task: entry.text,
            speaker: entry.speaker
          });
        }
      });
    });

    return followUp;
  }

  formatSummaryEmail(summary) {
    return `
סיכום פגישת ייעוץ
תאריך: ${summary.date}
משך: ${summary.duration}

נושאים עיקריים:
${summary.mainPoints.map(point => `• ${point.topic}: ${point.text}`).join('\n')}

בדיקות רגולטוריות:
• דיון בסיכונים: ${summary.regulatoryChecks.riskDiscussion ? '✓' : '✗'}
• מטרות השקעה: ${summary.regulatoryChecks.investmentObjectives ? '✓' : '✗'}
• צרכי לקוח: ${summary.regulatoryChecks.clientNeeds ? '✓' : '✗'}
• גילוי ניגוד עניינים: ${summary.regulatoryChecks.conflictOfInterest ? '✓' : '✗'}

משימות להמשך:
${summary.followUpItems.map(item => `• ${item.task}`).join('\n')}
`;
  }
}

export default new TranscriptionService();