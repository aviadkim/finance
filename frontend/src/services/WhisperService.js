class WhisperService {
  constructor() {
    this.CHUNK_SIZE = 25 * 1024 * 1024; // 25MB chunks (Whisper's limit)
  }

  async transcribeAudio(audioBlob, progressCallback) {
    try {
      // Convert audio to correct format if needed
      const formattedAudio = await this.formatAudioForWhisper(audioBlob);
      
      // Split into chunks if necessary
      const chunks = await this.splitAudioIntoChunks(formattedAudio);
      
      let fullTranscript = '';
      
      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const progress = ((i + 1) / chunks.length) * 100;
        
        const formData = new FormData();
        formData.append('file', chunk, 'audio.wav');
        formData.append('model', 'whisper-1');
        formData.append('language', 'he'); // Hebrew
        formData.append('response_format', 'verbose_json');
        
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Transcription failed: ${response.statusText}`);
        }

        const result = await response.json();
        fullTranscript += result.text + ' ';
        
        // Report progress
        if (progressCallback) {
          progressCallback(progress, fullTranscript);
        }
      }

      return fullTranscript.trim();
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }

  async transcribeLive(audioStream, onTranscript) {
    const mediaRecorder = new MediaRecorder(audioStream);
    let audioChunks = [];
    
    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
        
        // Every 5 seconds, process the accumulated audio
        if (audioChunks.length >= 5) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          try {
            const transcript = await this.transcribeAudio(audioBlob);
            onTranscript(transcript);
          } catch (error) {
            console.error('Live transcription error:', error);
          }
          audioChunks = []; // Reset chunks
        }
      }
    };

    // Collect data every second
    mediaRecorder.start(1000);
    
    return mediaRecorder;
  }

  private async formatAudioForWhisper(audioBlob) {
    // Convert to WAV if not already
    if (audioBlob.type !== 'audio/wav') {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioData = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      
      // Convert to WAV
      const wavBlob = await this.audioBufferToWav(audioBuffer);
      return wavBlob;
    }
    return audioBlob;
  }

  private async splitAudioIntoChunks(audioBlob) {
    if (audioBlob.size <= this.CHUNK_SIZE) {
      return [audioBlob];
    }

    const chunks = [];
    let offset = 0;
    
    while (offset < audioBlob.size) {
      chunks.push(audioBlob.slice(offset, offset + this.CHUNK_SIZE));
      offset += this.CHUNK_SIZE;
    }

    return chunks;
  }

  private audioBufferToWav(buffer) {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const result = new Float32Array(buffer.length * numberOfChannels);
    
    // Interleave channels
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < channelData.length; i++) {
        result[i * numberOfChannels + channel] = channelData[i];
      }
    }

    // Convert to 16-bit PCM
    const dataView = new DataView(new ArrayBuffer(44 + result.length * 2));
    
    // Write WAV header
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(dataView, 0, 'RIFF');
    dataView.setUint32(4, 36 + result.length * 2, true);
    writeString(dataView, 8, 'WAVE');
    writeString(dataView, 12, 'fmt ');
    dataView.setUint32(16, 16, true);
    dataView.setUint16(20, format, true);
    dataView.setUint16(22, numberOfChannels, true);
    dataView.setUint32(24, sampleRate, true);
    dataView.setUint32(28, sampleRate * numberOfChannels * 2, true);
    dataView.setUint16(32, numberOfChannels * 2, true);
    dataView.setUint16(34, bitDepth, true);
    writeString(dataView, 36, 'data');
    dataView.setUint32(40, result.length * 2, true);

    // Write PCM data
    const volume = 1;
    let offset = 44;
    for (let i = 0; i < result.length; i++) {
      const sample = Math.max(-1, Math.min(1, result[i])) * volume;
      dataView.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([dataView], { type: 'audio/wav' });
  }
}

export default new WhisperService();