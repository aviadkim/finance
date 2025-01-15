class TranscriptionService {
  constructor() {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'he-IL';
    } else {
      console.error('Speech recognition not supported');
    }
  }

  async transcribe(audioBlob) {
    return new Promise((resolve, reject) => {
      try {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        let transcript = '';
        let currentSpeaker = 1;
        let lastTimestamp = 0;

        this.recognition.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              // Change speaker if there's a significant pause
              const currentTime = audio.currentTime;
              if (currentTime - lastTimestamp > 2.0) {
                currentSpeaker = currentSpeaker === 1 ? 2 : 1;
                transcript += `\n[דובר ${currentSpeaker}]: `;
              }
              transcript += result[0].transcript + ' ';
              lastTimestamp = currentTime;
            }
          }
        };

        this.recognition.onend = () => {
          resolve({ text: transcript });
        };

        this.recognition.onerror = (error) => {
          reject(error);
        };

        audio.onplay = () => {
          this.recognition.start();
        };

        audio.onended = () => {
          this.recognition.stop();
        };

        transcript = `[דובר 1]: `;
        audio.play();
      } catch (error) {
        reject(error);
      }
    });
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