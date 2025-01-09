class RecordingService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.onTranscriptUpdate = null;
    this.recognition = null;
  }

  async initializeRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      
      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window) {
        this.recognition = new window.webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'he-IL'; // Hebrew language

        this.recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript + ' ';
            }
          }
          if (this.onTranscriptUpdate) {
            this.onTranscriptUpdate(transcript);
          }
        };
      }

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      return true;
    } catch (error) {
      console.error('Error initializing recording:', error);
      return false;
    }
  }

  startRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
      this.audioChunks = [];
      this.mediaRecorder.start(1000); // Collect data every second
      if (this.recognition) {
        this.recognition.start();
      }
      return true;
    }
    return false;
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      if (this.recognition) {
        this.recognition.stop();
      }
      return true;
    }
    return false;
  }

  getAudioBlob() {
    return new Blob(this.audioChunks, { type: 'audio/wav' });
  }

  setTranscriptCallback(callback) {
    this.onTranscriptUpdate = callback;
  }
}

export default new RecordingService();