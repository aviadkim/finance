class TranscriptionService {
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.transcript = '';
  }

  startRecording(onTranscriptUpdate) {
    this.transcript = '';
    
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.transcript += transcriptText;
        } else {
          interimTranscript += transcriptText;
        }
      }
      
      onTranscriptUpdate(interimTranscript);
    };

    this.recognition.start();
  }

  stopRecording() {
    this.recognition.stop();
    return this.transcript;
  }

  generateSummary(transcript) {
    // Simple summary generation without API
    const sentences = transcript.split('.');
    const summary = sentences.slice(0, 3).join('. ') + '.';
    return summary;
  }
}

export default new TranscriptionService();