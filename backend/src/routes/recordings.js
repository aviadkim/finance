const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const { analyzeConversation } = require('../services/openai');

const router = express.Router();
const upload = multer({ memory: true });

// Upload and analyze recording
router.post('/upload', upload.single('recording'), async (req, res) => {
  try {
    const file = req.file;
    const { clientId } = req.body;

    // Upload to Firebase Storage
    const bucket = admin.storage().bucket();
    const blob = bucket.file(`recordings/${clientId}/${Date.now()}.wav`);
    await blob.save(file.buffer);

    // Get download URL
    const [url] = await blob.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });

    // TODO: Replace with actual transcription
    const mockTranscript = 'This is a mock transcript for testing';
    
    // Analyze conversation
    const analysis = await analyzeConversation(mockTranscript);

    // Save analysis to Firestore
    await admin.firestore().collection('conversations').add({
      clientId,
      recordingUrl: url,
      transcript: mockTranscript,
      analysis,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ url, analysis });
  } catch (error) {
    console.error('Error processing recording:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recordings by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const snapshot = await admin.firestore()
      .collection('conversations')
      .where('clientId', '==', clientId)
      .orderBy('timestamp', 'desc')
      .get();

    const recordings = [];
    snapshot.forEach(doc => recordings.push({ id: doc.id, ...doc.data() }));

    res.json(recordings);
  } catch (error) {
    console.error('Error fetching recordings:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;