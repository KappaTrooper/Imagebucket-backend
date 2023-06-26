const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();
const port = process.env.PORT || 9001;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB...');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

connectToMongoDB();

// Routes
app.use('/auth', authRoutes); // Mount the auth routes at /auth
app.use('/upload', uploadRoutes); // Mount the upload routes at /upload

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
