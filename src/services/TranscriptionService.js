class TranscriptionService {
  static async transcribeAudio(audioBlob) {
    try {
      console.log('Starting transcription process...');
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'he');

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

      const data = await response.json();
      console.log('Transcription completed:', data);
      return data.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  static async generateSummary(transcript) {
    try {
      console.log('Generating summary...');
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
              content: 'You are a financial advisor assistant. Summarize the meeting transcript and highlight key points, decisions, and action items.'
            },
            {
              role: 'user',
              content: transcript
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Summary generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Summary generated:', data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }
}

export default TranscriptionService;