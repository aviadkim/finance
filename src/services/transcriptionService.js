const openai = require('openai');

class TranscriptionService {
  constructor(apiKey) {
    this.client = new openai({ apiKey });
  }

  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'he');

      const response = await this.client.audio.transcribe(formData);
      return response.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  async generateSummary(transcript) {
    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "אתה עוזר ליועץ פיננסי. צור סיכום מובנה של השיחה, תוך התמקדות בנקודות העיקריות, המלצות, והחלטות שהתקבלו."
          },
          {
            role: "user",
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