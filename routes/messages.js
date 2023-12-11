const express = require('express');
const router = express.Router();

const admin = require('firebase-admin')
const db = admin.firestore();

const authenticateToken = require("../middleware/auth");

router.post('/send', authenticateToken,  async (req, res) => {
  try {
    const { conversationId, user, message } = req.body;

    const conversationRef = db.collection('conversations').doc(conversationId);
    const messageRef = conversationRef.collection('messages').doc();

    await messageRef.set({
      user: user,
      message: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ success: true, message: 'Pesan terkirim' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
  }
});

router.get('/:conversationId', authenticateToken,  async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messagesRef = db.collection(`conversations/${conversationId}/messages`);
    const snapshot = await messagesRef.get();

    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
  }
});

module.exports = router;