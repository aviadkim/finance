class TranscriptionService {
  static async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', 'he,en'); // Support both Hebrew and English

      // Using Azure Speech-to-Text (free tier) instead of OpenAI
      const response = await fetch('https://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1', {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.REACT_APP_AZURE_SPEECH_KEY,
          'Content-Type': 'audio/wav'
        },
        body: audioBlob
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const result = await response.json();
      return result.DisplayText;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  static async generateSummary(text) {
    try {
      // Using Azure Language Understanding instead of OpenAI
      const response = await fetch('https://westeurope.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/your-app-id/slots/production/predict', {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.REACT_APP_AZURE_LANGUAGE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: text
        })
      });

      if (!response.ok) {
        throw new Error('Summary generation failed');
      }

      const result = await response.json();
      return result.prediction.topIntent;
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }
}

export default TranscriptionService;