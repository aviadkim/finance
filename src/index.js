const express = require('express');
const cors = require('cors');
const { initialize } = require('./services/recording');
const { setupRegulatoryQuestions } = require('./services/questions');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize recording service
const server = initialize(app);

// Setup regulatory questions
setupRegulatoryQuestions(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));