const OpenAI = require('openai');

class TranscriptionService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async transcribeAudio(audioFile) {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'he'
      });

      return transcription.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  async generateSummary(transcript) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'אתה עוזר ליועץ פיננסי. צור סיכום מקצועי של השיחה, תוך הדגשת הנקודות העיקריות, המלצות והחלטות.'
          },
          {
            role: 'user',
            content: transcript
          }
        ]
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }
}

module.exports = new TranscriptionService();