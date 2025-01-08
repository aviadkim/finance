
const OpenAI = require('openai');
const { Writable } = require('stream');
const fs = require('fs').promises;
const path = require('path');

class RecordingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.activeSessions = new Map();
    this.recordingsPath = path.join(__dirname, '../../../recordings');
  }

  async initializeSession(sessionId) {
    const sessionPath = path.join(this.recordingsPath, sessionId);
    await fs.mkdir(sessionPath, { recursive: true });
    
    const session = {
      id: sessionId,
      path: sessionPath,
      chunks: [],
      transcript: '',
      startTime: new Date()
    };
    
    this.activeSessions.set(sessionId, session);
    return session;
  }

  async processAudioChunk(sessionId, chunk) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Save chunk
    session.chunks.push(chunk);

    // Transcribe if chunk is large enough
    if (session.chunks.length >= 5) {
      await this.transcribeChunks(session);
    }
  }

  async transcribeChunks(session) {
    try {
      const audioBuffer = Buffer.concat(session.chunks);
      const tempFilePath = path.join(session.path, 'temp.wav');
      await fs.writeFile(tempFilePath, audioBuffer);

      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
        language: 'he'
      });

      session.transcript += transcription.text + ' ';
      session.chunks = []; // Clear processed chunks

      return transcription.text;
    } catch (error) {
      console.error('Transcription error:', error);
      return '';
    }
  }

  async finalizeSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Process any remaining chunks
    if (session.chunks.length > 0) {
      await this.transcribeChunks(session);
    }

    // Save final transcript
    const transcriptPath = path.join(session.path, 'transcript.txt');
    await fs.writeFile(transcriptPath, session.transcript);

    // Cleanup
    this.activeSessions.delete(sessionId);

    return {
      sessionId,
      duration: (new Date() - session.startTime) / 1000,
      transcript: session.transcript
    };
  }
}

module.exports = new RecordingService();
