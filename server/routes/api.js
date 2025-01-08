const express = require('express');
const router = express.Router();
const { recognizeSpeech } = require('../services/speechService');
const { analyzeCompliance } = require('../services/regulatoryService');
const { saveAudioFile, saveTranscript } = require('../services/storageService');

// Process live recording or uploaded file
router.post('/process-audio', async (req, res) => {
  try {
    const { audioData, language } = req.body;
    const transcript = await recognizeSpeech(audioData, language);
    const compliance = await analyzeCompliance(transcript);
    
    // Save the results
    const timestamp = new Date().toISOString();
    await saveTranscript({ transcript, compliance }, `transcript-${timestamp}.json`);
    
    res.json({ transcript, compliance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get regulatory questions
router.get('/questions', async (req, res) => {
  try {
    const questions = require('../config/questions.json');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate report
router.post('/generate-report', async (req, res) => {
  try {
    const { transcript, compliance, metadata } = req.body;
    const report = generateReport(transcript, compliance, metadata);
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;