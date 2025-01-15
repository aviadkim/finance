class TranscriptionService {
  constructor() {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      console.error('Speech recognition not supported');
    }
    this.currentTranscript = '';
    this.onTranscriptUpdate = null;
  }

  setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'he-IL';

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.currentTranscript += ' ' + finalTranscript;
      }

      const fullTranscript = this.currentTranscript + ' ' + interimTranscript;
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(fullTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };

    this.recognition.onend = () => {
      if (this.isRecording) {
        this.recognition.start();
      }
    };
  }

  startLiveTranscription(callback) {
    this.currentTranscript = '';
    this.onTranscriptUpdate = callback;
    this.isRecording = true;
    this.recognition.start();
  }

  stopLiveTranscription() {
    this.isRecording = false;
    this.recognition.stop();
    this.onTranscriptUpdate = null;
  }

  getCurrentTranscript() {
    return this.currentTranscript;
  }
}

const transcriptionService = new TranscriptionService();
export { transcriptionService as TranscriptionService };
export default transcriptionService;