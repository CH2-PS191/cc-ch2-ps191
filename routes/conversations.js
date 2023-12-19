const express = require('express');
const router = express.Router();
const axios = require('axios');
const admin = require('firebase-admin');
const db = admin.firestore();

const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, async (req, res) => {
  const conversationsRef = db.collection('conversations');
  conversationsRef.where('member', 'array-contains', req.user.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(404).json({ success: false, error: 'Tidak ada dokumen yang memenuhi kriteria.' });
      }
      const conversations = [];

      snapshot.forEach((doc) => {
        conversations.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json({ success: true, conversations });
    })
    .catch((error) => {
      console.error('Error saat mengambil dokumen:', error);
      res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
    });
});

router.post('/create', authenticateToken, async (req, res) => {
  const conversationRef = db.collection('conversations');
  const newConversation = {
    member: ['bot', req.user.uid],
  };

  conversationRef.add(newConversation)
    .then((docRef) => {
      res.status(200).json({ success: true, message: `Dokumen berhasil ditambahkan`, id: docRef.id });
    })
    .catch((error) => {
      console.error('Error saat menambahkan dokumen:', error);
      res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
    });
});

router.get('/:conversationId', authenticateToken, async (req, res) => {
  const conversationId = req.params.conversationId;
  const conversationRef = db.collection('conversations').doc(conversationId);

  conversationRef.get()
    .then((conversationDoc) => {
      if (!conversationDoc.exists) {
        return res.status(404).json({ success: false, error: 'Percakapan tidak ditemukan.' });
      }

      const conversationData = conversationDoc.data();

      // Periksa apakah req.user.uid adalah salah satu dari member
      if (conversationData.member.includes(req.user.uid)) {
        const messagesRef = conversationRef.collection('messages').orderBy("timestamp", "asc");
        messagesRef.get().then((snapshot) => {
          if (snapshot.empty) {
            return res.status(404).json({ success: false, error: 'Tidak ada pesan.' });
          }

          const messages = [];

          snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
          });

          res.status(200).json({ success: true, messages });
        })
      } else {
        res.status(403).json({ success: false, error: 'Akses ditolak.' });
      }
    }
    )
    .catch((error) => {
      console.error('Error saat mengambil dokumen:', error);
      res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
    });
});

router.put('/:conversationId/update', authenticateToken, async (req, res) => {
  const conversationId = req.params.conversationId;
  const pakarUid = req.body.pakarUid;
  const conversationRef = db.collection('conversations').doc(conversationId);

  conversationRef.get()
    .then((conversationDoc) => {
      if (!conversationDoc.exists) {
        return res.status(404).json({ success: false, error: 'Percakapan tidak ditemukan.' });
      }

      const members = conversationDoc.data().member;

      // Periksa apakah req.user.uid adalah salah satu dari member
      if (members.includes(req.user.uid)) {
        if (!members.includes(pakarUid)) {
          members.push(pakarUid);
          conversationRef.update({ member: members });
          res.status(200).json({ success: true, message: 'Pakar atau sebaya berhasil ditambah' });
        } else {
          res.status(409).json({ success: false, message: 'Data sudah ada' });
        }
      } else {
        res.status(403).json({ success: false, error: 'Akses ditolak.' });
      }
    }
    )
    .catch((error) => {
      console.error('Error saat mengambil dokumen:', error);
      res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
    });
});

router.post('/:conversationId/create', authenticateToken, async (req, res) => {
  const conversationId = req.params.conversationId;
  const message = req.body.message;
  const conversationRef = db.collection('conversations').doc(conversationId);

  const url = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=https://chatbot-52o7pqozoa-et.a.run.app/predict';
  const headers = {
    'Metadata-Flavor': 'Google'
  };

  endpoint = 'https://chatbot-52o7pqozoa-et.a.run.app/predict';
  endpointData = {
    "input_text": message
  }

  axios.get(url, { headers })
    .then(response => {
      axios.post(endpoint, endpointData, {
        headers: {
          'Authorization': `Bearer ${response.data}`
        }
      })
        .then((response) => {
          conversationRef.get()
            .then((conversationDoc) => {
              if (!conversationDoc.exists) {
                return res.status(404).json({ success: false, error: 'Percakapan tidak ditemukan.' });
              }
              const conversationData = conversationDoc.data();
              // Periksa apakah req.user.uid adalah salah satu dari member
              if (conversationData.member.includes(req.user.uid)) {
                const messagesRef = conversationRef.collection('messages');
                const newMessage = {
                  uid: req.user.uid,
                  message: message,
                  timestamp: admin.firestore.FieldValue.serverTimestamp() //ini udah gmt7
                };

                const newMessagebot = {
                  uid: 'bot',
                  message: response.data.answer,
                  timestamp: admin.firestore.FieldValue.serverTimestamp() //ini udah gmt7
                };
                messagesRef.add(newMessage)
                  .then((docRef) => {
                    console.log(`Dokumen berhasil ditambahkan dengan ID: ${docRef.id}`);
                    setTimeout(() => {
                      messagesRef.add(newMessagebot)
                      .then((docRef1) => {
                        console.log(`Dokumen berhasil ditambahkan dengan ID: ${docRef1.id}`);
                        res.status(200).json({
                          success: true,
                          message: `Dokumen berhasil ditambahkan`,
                          id: docRef.id,
                          idresponsebot: docRef1.id,
                          response: response.data.answer,
                          tag: response.data.tag
                        });
                      })
                    }, 500);
                  })
              } else {
                res.status(403).json({ success: false, error: 'Akses ditolak.' });
              }
            }
            )
        })
    })
    .catch((error) => {
      console.error('Error saat memanggil endpoint lain:', error);
      res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
    });
});

router.post('/:conversationId/selfcreate', authenticateToken, async (req, res) => {
  const conversationId = req.params.conversationId;
  const message = req.body.message;
  const conversationRef = db.collection('conversations').doc(conversationId);

  conversationRef.get()
    .then((conversationDoc) => {
      if (!conversationDoc.exists) {
        return res.status(404).json({ success: false, error: 'Percakapan tidak ditemukan.' });
      }
      const conversationData = conversationDoc.data();
      // Periksa apakah req.user.uid adalah salah satu dari member
      if (conversationData.member.includes(req.user.uid)) {
        const messagesRef = conversationRef.collection('messages');
        const newMessage = {
          uid: req.user.uid,
          message: message,
          timestamp: admin.firestore.FieldValue.serverTimestamp() //ini udah gmt7
        };

        messagesRef.add(newMessage)
          .then((docRef) => {
            console.log(`Dokumen berhasil ditambahkan dengan ID: ${docRef.id}`);
            res.status(200).json({
              success: true,
              message: `Dokumen berhasil ditambahkan`,
              id: docRef.id
            });
          })
      } else {
        res.status(403).json({ success: false, error: 'Akses ditolak.' });
      }
    }
    )
    .catch((error) => {
      console.error('Error saat memanggil endpoint lain:', error);
      res.status(500).json({ success: false, error: 'Terjadi kesalahan' });
    });
});

module.exports = router;