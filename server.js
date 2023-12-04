const express = require('express');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 8080;

const serviceAccount = require("./credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware
// TODO: Pisahkan middleware ke folder lain
const authenticateToken = (req, res, next) => {
  const idToken = req.header('Authorization');

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    });
};

// TODO: Pisahkan route
app.get('/', authenticateToken, (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});

/*
TODO:
1. mvc
2. Koneksi db
4. Logout ??????????????????
*/