class TranscriptionService {
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'he-IL';
  }

  startFreeTranscription(onTranscript, onError) {
    try {
      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        onTranscript(transcript);
      };

      this.recognition.onerror = (event) => {
        onError(event.error);
      };

      this.recognition.start();
      return true;
    } catch (error) {
      onError(error);
      return false;
    }
  }

  stopFreeTranscription() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Helper to prepare ChatGPT prompt
  prepareAnalysisPrompt(transcript) {
    return `ניתוח פגישת ייעוץ פיננסי:

תמליל השיחה:
${transcript}

אנא ספק:
1. סיכום עיקרי הפגישה
2. שאלות רגולטוריות שנענו
3. שאלות חסרות שצריך להשלים
4. המלצות והחלטות שהתקבלו
5. משימות להמשך`;
  }

  // For future paid API integration
  async startPaidTranscription(audioBlob) {
    // Implementation for Whisper API when needed
    throw new Error('Paid transcription not implemented yet');
  }

  async getQuickSummary(transcript) {
    // Free version - prepare for manual ChatGPT
    const prompt = this.prepareAnalysisPrompt(transcript);
    return {
      prompt,
      copyToClipboard: () => navigator.clipboard.writeText(prompt)
    };
  }

  // Additional helper methods
  detectRegulationTopics(transcript) {
    const topics = {
      riskDiscussion: transcript.includes('סיכון') || transcript.includes('רמת סיכון'),
      investmentChanges: transcript.includes('שינוי') || transcript.includes('השקעה'),
      clientNeeds: transcript.includes('צרכים') || transcript.includes('מטרות'),
    };

    return topics;
  }

  generateEmailDraft(summary) {
    return `שלום,

מצורף סיכום פגישתנו מהיום:

${summary}

נקודות עיקריות לטיפול:
• 
• 
• 

נשמח לעמוד לרשותך בכל שאלה.

בברכה,`;
  }
}

export default new TranscriptionService();