class AudioRecordingService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.startTime = null;
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.startTime = new Date();

      this.mediaRecorder.addEventListener('dataavailable', event => {
        this.audioChunks.push(event.data);
      });

      this.mediaRecorder.start(1000); // Collect data every second
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

          // Create a download link
          const timestamp = this.formatTimestamp(this.startTime);
          const downloadLink = document.createElement('a');
          downloadLink.href = audioUrl;
          downloadLink.download = `recording_${timestamp}.wav`;
          downloadLink.click();

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

  formatTimestamp(date) {
    return date.toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .replace('Z', '');
  }

  isRecording() {
    return this.mediaRecorder && this.mediaRecorder.state === 'recording';
  }

  getStartTime() {
    return this.startTime;
  }
}

const audioRecordingService = new AudioRecordingService();
export { audioRecordingService as AudioRecordingService };
export default audioRecordingService;