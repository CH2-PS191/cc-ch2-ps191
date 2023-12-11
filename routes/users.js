const express = require('express');
const {format} = require('util');
const {Storage} = require('@google-cloud/storage');
const admin = require('firebase-admin')

const authenticateToken = require("../middleware/auth");
const multer = require('../middleware/multer');

const storage = new Storage({ keyFilename: "credentials-bucket.json" }); //dev
// const storage = new Storage(); //ini kalo prod
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
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;