const { SpeechClient } = require('@google-cloud/speech');
const client = new SpeechClient();

async function recognizeSpeech(audioContent, language) {
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: language === 'hebrew' ? 'he-IL' : 'en-US',
    enableAutomaticPunctuation: true,
    model: 'default',
    useEnhanced: true,
  };

  const audio = {
    content: audioContent,
  };

  const request = {
    config: config,
    audio: audio,
  };

  try {
    const [response] = await client.recognize(request);
    return response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  } catch (error) {
    throw new Error(`Speech recognition failed: ${error.message}`);
  }
}

module.exports = { recognizeSpeech };