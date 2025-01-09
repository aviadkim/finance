class AIService {
  constructor() {
    this.openaiApiKey = null; // Will be set from environment variables
    this.isProcessing = false;
  }

  async processAudio(audioBlob) {
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not set');
      return null;
    }

    try {
      // First, transcribe with Whisper
      const transcription = await this.transcribeAudio(audioBlob);
      
      // Then analyze with ChatGPT
      const analysis = await this.analyzeConversation(transcription);

      return {
        transcription,
        analysis
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      return null;
    }
  }

  async transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'he'); // Hebrew

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  }

  async analyzeConversation(transcript) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are analyzing a conversation between a financial advisor and a client in Hebrew.
            Identify:
            1. Required regulatory questions asked and their answers
            2. Client's needs and concerns
            3. Recommendations made
            4. Follow-up items
            5. Risk disclosures
            
            Format the response in JSON with these categories.`
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
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  async processLiveTranscript(transcript) {
    if (this.isProcessing) return null;
    this.isProcessing = true;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are assisting a financial advisor during a live conversation.
              Based on the conversation transcript:
              1. Identify regulatory questions that should be asked next
              2. Note any missing required disclosures
              3. Suggest follow-up questions based on client responses
              4. Highlight potential compliance issues
              
              Respond in Hebrew and format as JSON.`
            },
            {
              role: 'user',
              content: transcript
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      this.isProcessing = false;
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error processing live transcript:', error);
      this.isProcessing = false;
      return null;
    }
  }

  setApiKey(key) {
    this.openaiApiKey = key;
  }
}

export default new AIService();