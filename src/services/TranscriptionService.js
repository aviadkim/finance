import axios from 'axios';

class TranscriptionService {
  constructor() {
    this.openaiConfig = {
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      baseURL: 'https://api.openai.com/v1'
    };
  }

  async transcribe(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'he');
      formData.append('prompt', 'Transcribe this financial meeting in Hebrew. Avoid repeating words.');
      formData.append('response_format', 'verbose_json');
      formData.append('timestamp_granularities', '["word", "segment"]');

      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.openaiConfig.apiKey}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Post-process to clean up any remaining repetitions
      const text = this.cleanRepetitions(response.data.text);
      return { ...response.data, text };
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  cleanRepetitions(text) {
    // Split into sentences
    const sentences = text.split('.');
    
    // Clean each sentence
    const cleanedSentences = sentences.map(sentence => {
      // Split into words
      const words = sentence.trim().split(' ');
      
      // Remove consecutive duplicates
      const uniqueWords = words.filter((word, index) => {
        if (index === 0) return true;
        const prevWord = words[index - 1].toLowerCase();
        const currentWord = word.toLowerCase();
        return prevWord !== currentWord;
      });
      
      return uniqueWords.join(' ');
    });
    
    return cleanedSentences.join('. ').trim();
  }

  async summarize(text) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a financial advisor assistant. Create a concise summary of the meeting transcript below, focusing on key financial decisions, action items, and important notes. The summary should be in Hebrew and professional in tone. Ignore any repeated phrases or words in the input.`
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiConfig.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Summarization error:', error);
      throw error;
    }
  }
}

const transcriptionService = new TranscriptionService();
export { transcriptionService as TranscriptionService };
export default transcriptionService;