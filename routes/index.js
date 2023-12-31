const express = require('express');
const router = express.Router();

const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${JSON.stringify(req.user)}!`);
});

module.exports = router;