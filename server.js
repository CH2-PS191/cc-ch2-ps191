const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
admin.initializeApp();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8080;

const conversationRoute = require('./routes/conversations')
const userRoute = require('./routes/users')
app.use('/conversation', conversationRoute)
app.use('/user', userRoute)

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});