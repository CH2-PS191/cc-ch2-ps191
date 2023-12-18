const express = require('express');
const {format} = require('util');
const {Storage} = require('@google-cloud/storage');
const admin = require('firebase-admin')

const authenticateToken = require("../middleware/auth");
const multer = require('../middleware/multer');

const storage = new Storage();
const bucket = storage.bucket("userimgempaq");

const router = express.Router();
router.put('/update', [authenticateToken, multer.single('file')], (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  const fileExtension = req.file.originalname.split('.').pop();
  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.user.uid+Date.now()+'.'+fileExtension);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    admin.auth()
      .updateUser(req.user.uid, {
        photoURL: publicUrl
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully updated user', userRecord.toJSON());
      })
      .catch((error) => {
        console.log('Error updating user:', error);
      });
    res.status(200).json({ publicUrl });
  });

  blobStream.end(req.file.buffer);
});

router.get('/pakar', authenticateToken, (req, res) => {
  const pakar = [];

  const listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    return admin.auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          const customClaims = userRecord.customClaims || {};
          if (customClaims.pakar) {
            // console.log('Pakar user', userRecord.toJSON());
            pakar.push({ ...userRecord });
          }
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          return listAllUsers(listUsersResult.pageToken);
        }
      });
  };

  // Start listing users from the beginning, 1000 at a time.
  listAllUsers()
    .then(() => {
      res.status(200).json({ pakar });
    })
    .catch((error) => {
      console.log('Error listing users:', error);
      res.status(500).json({ error });
    });
});

router.get('/sebaya', authenticateToken, (req, res) => {
  const sebaya = [];

  const listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    return admin.auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          const customClaims = userRecord.customClaims || {};
          if (customClaims.sebaya) {
            console.log('Sebaya user', userRecord.toJSON());
            sebaya.push({ ...userRecord });
          }
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          return listAllUsers(listUsersResult.pageToken);
        }
      });
  };

  // Start listing users from the beginning, 1000 at a time.
  listAllUsers()
    .then(() => {
      res.status(200).json ({ sebaya });
    })
    .catch((error) => {
      console.log('Error listing users:', error);
      res.status(500).json({ error });
    });
});

router.post('/conversationclaims', authenticateToken, (req, res) => {
  admin.auth()
  .setCustomUserClaims(req.user.uid, { conversationId: req.body.conversationId })
  .then(
    admin.auth()
      .getUser(req.user.uid)
      .then((userRecord) => {
        res.status(200).json({ conversationId: userRecord.customClaims.conversationId });
      })
  ).catch((error) => {
    console.log(error);
    res.status(500).json({ error });
  });
});

module.exports = router;