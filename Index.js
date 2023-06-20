const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
// import routes
const Upload = require('./routes/upload');

const app = express();
const port = process.env.PORT || 9001;
// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve static files

// use async await to connect to MongoDB instead of callback
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB... ;)');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}


connectToMongoDB();

app.use(Upload);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log(process.env.MONGO_URL)
  console.log(process.env.PORT)
});
