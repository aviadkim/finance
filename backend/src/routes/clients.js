const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

// Get client information and history
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Get client details
    const clientDoc = await admin.firestore()
      .collection('clients')
      .doc(clientId)
      .get();

    if (!clientDoc.exists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Get recent conversations
    const conversationsSnapshot = await admin.firestore()
      .collection('conversations')
      .where('clientId', '==', clientId)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    const conversations = [];
    conversationsSnapshot.forEach(doc => {
      conversations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      client: { id: clientDoc.id, ...clientDoc.data() },
      conversations
    });
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update client information
router.put('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const updateData = req.body;

    await admin.firestore()
      .collection('clients')
      .doc(clientId)
      .update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;