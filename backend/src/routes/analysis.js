const express = require('express');
const admin = require('firebase-admin');
const { analyzeConversation } = require('../services/openai');

const router = express.Router();

// Analyze existing recording
router.post('/analyze/:recordingId', async (req, res) => {
  try {
    const { recordingId } = req.params;
    const doc = await admin.firestore()
      .collection('conversations')
      .doc(recordingId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Recording not found' });
    }

    const data = doc.data();
    const analysis = await analyzeConversation(data.transcript);

    // Update document with analysis
    await doc.ref.update({ analysis });

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing recording:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get analysis summary
router.get('/summary/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const snapshot = await admin.firestore()
      .collection('conversations')
      .where('clientId', '==', clientId)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const analyses = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.analysis) {
        analyses.push({
          id: doc.id,
          timestamp: data.timestamp,
          analysis: data.analysis
        });
      }
    });

    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;