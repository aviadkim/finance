class TranscriptionService {
  static async transcribe(audioData) {
    try {
      const formData = new FormData();
      formData.append('file', audioData);
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  static async summarize(text) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a financial advisor assistant. Summarize the meeting transcript highlighting key points, decisions, and action items.'
            },
            {
              role: 'user',
              content: `Please summarize the following meeting transcript: ${text}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Summarization failed');
      }

      const result = await response.json();
      return result.choices[0].message.content;
    } catch (error) {
      console.error('Summarization error:', error);
      throw error;
    }
  }
}

export { TranscriptionService };