const express = require('express');
const cors = require('cors')
const admin = require('firebase-admin');
const serviceAccount = require("./credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}); //ini di dev
// admin.initializeApp(); //ini kalo prod


const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8080;

const indexRoute = require('./routes/index')
const conversationRoute = require('./routes/conversations')
const userRoute = require('./routes/users')
app.use('/', indexRoute) //ini buat testing
app.use('/conversation', conversationRoute)
app.use('/user', userRoute)

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});