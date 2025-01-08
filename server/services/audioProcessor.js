const { SpeechClient } = require('@google-cloud/speech');
const config = require('../config');

const speechClient = new SpeechClient();

async function processAudio(audioBuffer, language = 'hebrew') {
  const audio = {
    content: audioBuffer.toString('base64'),
  };
  
  const requestConfig = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: config.speechToText.languages[language].code,
    enableAutomaticPunctuation: config.speechToText.languages[language].enableAutomaticPunctuation,
  };

  try {
    const [response] = await speechClient.recognize({
      audio,
      config: requestConfig,
    });
    return response.results.map(result => result.alternatives[0].transcript);
  } catch (error) {
    throw new Error(`Audio processing failed: ${error.message}`);
  }
}

module.exports = { processAudio };