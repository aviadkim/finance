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
    this.recordingStartTime = null;
  }

  setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'he-IL'; // Default to Hebrew

    // Handle language detection and switching
    this.recognition.onend = () => {
      if (this.isRecording) {
        // Detect language from last few words
        const lastWords = this.currentTranscript.split(' ').slice(-5).join(' ');
        const seemsEnglish = /[a-zA-Z]{3,}/.test(lastWords);
        const seemsHebrew = /[\u0590-\u05FF]{2,}/.test(lastWords);

        if (seemsEnglish && this.recognition.lang !== 'en-US') {
          console.log('Switching to English');
          this.recognition.lang = 'en-US';
        } else if (seemsHebrew && this.recognition.lang !== 'he-IL') {
          console.log('Switching to Hebrew');
          this.recognition.lang = 'he-IL';
        }

        this.recognition.start();
      }
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.currentTranscript += finalTranscript;
      }

      if (this.onTranscriptUpdate) {
        const fullTranscript = this.currentTranscript + interimTranscript;
        const currentTime = this.recordingStartTime ? 
          (Date.now() - this.recordingStartTime) / 1000 : 0;

        this.onTranscriptUpdate(fullTranscript.trim(), currentTime);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };
  }

  startLiveTranscription(callback) {
    this.currentTranscript = '';
    this.onTranscriptUpdate = callback;
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    this.recognition.start();
  }

  stopLiveTranscription() {
    this.isRecording = false;
    this.recognition.stop();
    const finalTranscript = this.currentTranscript;
    this.onTranscriptUpdate = null;
    this.recordingStartTime = null;
    return finalTranscript;
  }

  getCurrentTranscript() {
    return this.currentTranscript;
  }

  getRecordingStartTime() {
    return this.recordingStartTime;
  }
}

const transcriptionService = new TranscriptionService();
export { transcriptionService as TranscriptionService };
export default transcriptionService;