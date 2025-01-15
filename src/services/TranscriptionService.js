class TranscriptionService {
  constructor() {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      console.error('Speech recognition not supported');
    }
  }

  setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'he-IL';

    // Increase these values for better continuous recognition
    this.recognition.maxAlternatives = 1;
  }

  async transcribe(audioBlob) {
    return new Promise((resolve, reject) => {
      try {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        let transcript = '';
        let currentSpeaker = 1;
        let lastTimestamp = 0;
        let buffer = '';

        this.recognition.onresult = (event) => {
          const currentTime = audio.currentTime;
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              // Add buffered text to transcript with proper formatting
              if (buffer.length > 0) {
                // Change speaker if there's a significant pause
                if (currentTime - lastTimestamp > 2.0) {
                  currentSpeaker = currentSpeaker === 1 ? 2 : 1;
                  transcript += `\n[דובר ${currentSpeaker}]: `;
                }
                transcript += buffer + ' ' + result[0].transcript + ' ';
                buffer = '';
                lastTimestamp = currentTime;
              } else {
                transcript += result[0].transcript + ' ';
              }
            } else {
              // Buffer interim results
              buffer = result[0].transcript;
            }
          }
        };

        this.recognition.onend = () => {
          // Add any remaining buffered text
          if (buffer.length > 0) {
            transcript += buffer;
          }
          resolve({ text: this.formatTranscript(transcript) });
        };

        this.recognition.onerror = (error) => {
          console.error('Recognition error:', error);
          reject(error);
        };

        audio.onplay = () => {
          this.recognition.start();
        };

        audio.onended = () => {
          this.recognition.stop();
        };

        // Start with the first speaker
        transcript = `[דובר 1]: `;
        audio.play();
      } catch (error) {
        console.error('Transcription error:', error);
        reject(error);
      }
    });
  }

  formatTranscript(text) {
    // Remove extra spaces and duplicates
    return text
      .replace(/\s+/g, ' ')
      .replace(/([^\s]+)\s+\1/g, '$1')
      .trim();
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

const transcriptionService = new TranscriptionService();
export { transcriptionService as TranscriptionService };
export default transcriptionService;