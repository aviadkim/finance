const express = require('express');
const router = express.Router();
const { processAudio } = require('../services/audioProcessor');
const { analyzeCompliance } = require('../services/complianceAnalyzer');

router.post('/process-audio', async (req, res) => {
  try {
    const { audioData, language } = req.body;
    const transcript = await processAudio(audioData, language);
    const compliance = await analyzeCompliance(transcript);
    res.json({ transcript, compliance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/analyze-recording', async (req, res) => {
  try {
    const { recordingData } = req.body;
    const transcript = await processAudio(recordingData);
    const compliance = await analyzeCompliance(transcript);
    res.json({ transcript, compliance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;