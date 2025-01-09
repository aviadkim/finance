require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { initializeFirebase } = require('./config/firebase');
const recordingRoutes = require('./routes/recordings');
const analysisRoutes = require('./routes/analysis');
const clientRoutes = require('./routes/clients');

const app = express();

// Initialize Firebase
initializeFirebase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recordings', recordingRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/clients', clientRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});