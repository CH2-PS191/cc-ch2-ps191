const admin = require('firebase-admin')

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

module.exports = authenticateToken;