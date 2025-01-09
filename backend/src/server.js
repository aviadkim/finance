require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const firebase = require('firebase-admin');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Firebase setup
const firebaseConfig = require('../firebaseConfig.json');
firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  storageBucket: process.env.FIREBASE_BUCKET,
});

// Google Drive setup
const driveAuth = new google.auth.GoogleAuth({
  keyFile: '../googleDriveConfig.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth: driveAuth });

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Regulatory questions API
const questions = [
  "האם זוהה הלקוח באופן מלא?",
  "האם נערך בירור צרכים מקיף?",
  "האם ניתן גילוי נאות מלא?",
  "האם נבדקו ניגודי עניינים?",
  "האם תועדו כל ההמלצות והנימוקים?",
];

app.get('/questions', (req, res) => {
  res.status(200).json(questions);
});

// Save conversation and recording
app.post('/save-conversation', upload.single('file'), async (req, res) => {
  try {
    const { platform, clientName, answers } = req.body;
    const file = req.file;

    // Generate PDF report
    const pdfPath = `reports/${Date.now()}_report.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    
    doc.fontSize(16).text('דוח שיחה עם לקוח', { align: 'right' });
    doc.moveDown();
    questions.forEach((q, i) => {
      doc.text(`${q}: ${answers[i] ? 'כן' : 'לא'}`, { align: 'right' });
    });
    doc.end();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.clientEmail,
      subject: 'סיכום שיחה',
      text: 'מצורף סיכום השיחה',
      attachments: [{ filename: 'report.pdf', path: pdfPath }]
    });

    res.status(200).json({
      message: 'Conversation saved successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});