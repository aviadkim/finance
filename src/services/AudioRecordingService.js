class AudioRecordingService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioBlob = null;
    this.isRecording = false;
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.isRecording = false;
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  async stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      return true;
    }
    return false;
  }

  getAudioBlob() {
    return this.audioBlob;
  }

  async saveRecording(filename) {
    if (!this.audioBlob) return null;
    
    const formData = new FormData();
    formData.append('audio', this.audioBlob, filename);
    
    try {
      const response = await fetch('/api/save-recording', {
        method: 'POST',
        body: formData
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error saving recording:', error);
      return null;
    }
  }
}

export default new AudioRecordingService();