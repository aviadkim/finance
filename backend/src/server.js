require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const firebase = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Regulatory questions
const regulatoryQuestions = [
    "האם הלקוח זוהה באופן מלא?",
    "האם בוצע עדכון צרכים מקיף?",
    "האם נבדקו ניגודי עניינים?",
    "האם ניתן גילוי נאות מלא?",
    "האם תועדו כל ההמלצות והנימוקים?",
    "האם הלקוח אישר את המדיניות?"
];

// Routes
app.get('/api/questions', (req, res) => {
    res.json(regulatoryQuestions);
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const { clientName, answers } = req.body;
        // Here you'll implement the file upload logic to Firebase/Google Drive
        res.json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});