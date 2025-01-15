class AudioRecordingService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', event => {
        this.audioChunks.push(event.data);
      });

      this.mediaRecorder.start();
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  async stopRecording() {
    return new Promise((resolve, reject) => {
      try {
        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          resolve({ audioBlob, audioUrl });
        });

        this.mediaRecorder.stop();
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error stopping recording:', error);
        reject(error);
      }
    });
  }

  isRecording() {
    return this.mediaRecorder && this.mediaRecorder.state === 'recording';
  }
}

const audioRecordingService = new AudioRecordingService();
export { audioRecordingService as AudioRecordingService };
export default audioRecordingService;