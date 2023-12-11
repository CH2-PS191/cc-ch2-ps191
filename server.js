const express = require('express');

const admin = require('firebase-admin');
const serviceAccount = require("./credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 8080;

const indexRoute = require('./routes/index')
const messageRoute = require('./routes/messages')
app.use('/', indexRoute) //ini buat testing
app.use('/message', messageRoute)

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});