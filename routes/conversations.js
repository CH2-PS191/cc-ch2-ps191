const express = require('express');
const router = express.Router();

const admin = require('firebase-admin')
const db = admin.firestore();

const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken,  async (req, res) => {
  const conversationsRef = db.collection('conversations');
  conversationsRef.where('member', 'array-contains', req.user.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(404).json({ success: false, error: 'Tidak ada dokumen yang memenuhi kriteria.' });
      }
      const messages = [];

      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json({ success: true, messages });
    })
    .catch((error) => {
      console.error('Error saat mengambil dokumen:', error);
      res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
    });
});

router.post('/create', authenticateToken,  async (req, res) => {
  const conversationRef = db.collection('conversations');
  const newConversation = {
    member: ['bot', req.user.uid],
  };

  conversationRef.add(newConversation)
  .then((docRef) => {
    res.status(200).json({ success: true, message: `Dokumen berhasil ditambahkan dengan ID: ${docRef.id}` });
  })
  .catch((error) => {
    console.error('Error saat menambahkan dokumen:', error);
    res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
  });
});

router.get('/:conversationId', authenticateToken,  async (req, res) => {
  const conversationId = req.params.conversationId;
  const messagesRef = db.collection(`conversations/${conversationId}/messages`);

  messagesRef.get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(404).json({ success: false, error: 'Tidak ada pesan.' });
      }
      const messages = [];

      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json({ success: true, messages });
    })
    .catch((error) => {
      console.error('Error saat mengambil dokumen:', error);
      res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
    });
});

router.post('/:conversationId/create', authenticateToken,  async (req, res) => {
  const conversationId = req.params.conversationId;
  const message = req.body.message;
  const messagesRef = db.collection(`conversations/${conversationId}/messages`);

  const newMessage = {
    uid: req.user.uid,
    message: message,
    timestamp: admin.firestore.FieldValue.serverTimestamp() //ini udah gmt7
  };

  messagesRef.add(newMessage)
  .then((docRef) => {
    res.status(200).json({ success: true, message: `Dokumen berhasil ditambahkan dengan ID: ${docRef.id}` });
  })
  .catch((error) => {
    console.error('Error saat menambahkan dokumen:', error);
    res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
  });
});

router.post('/:conversationId/bot', authenticateToken,  async (req, res) => {
  const conversationId = req.params.conversationId;
  const message = req.body.message;
  const messagesRef = db.collection(`conversations/${conversationId}/messages`);

  const newMessage = {
    uid: 'bot',
    message: message,
    timestamp: admin.firestore.FieldValue.serverTimestamp() //ini udah gmt7
  };

  messagesRef.add(newMessage)
  .then((docRef) => {
    res.status(200).json({ success: true, message: `Dokumen berhasil ditambahkan dengan ID: ${docRef.id}` });
  })
  .catch((error) => {
    console.error('Error saat menambahkan dokumen:', error);
    res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
  });
});


module.exports = router;