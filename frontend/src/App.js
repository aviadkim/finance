import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Checkbox, FormControlLabel, Box } from '@material-ui/core';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [file, setFile] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [storagePlatform, setStoragePlatform] = useState('firebase');

  useEffect(() => {
    // Fetch questions from backend
    axios.get('http://localhost:3000/questions')
      .then(response => {
        setQuestions(response.data);
        const initialAnswers = {};
        response.data.forEach((_, index) => {
          initialAnswers[index] = false;
        });
        setAnswers(initialAnswers);
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleAnswerChange = (index) => {
    setAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('platform', storagePlatform);
    formData.append('clientName', clientName);
    formData.append('clientEmail', clientEmail);
    formData.append('answers', JSON.stringify(answers));

    try {
      const response = await axios.post('http://localhost:3000/save-conversation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('שיחה נשמרה בהצלחה!');
    } catch (error) {
      console.error('Error saving conversation:', error);
      alert('שגיאה בשמירת השיחה');
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          מערכת תיעוד שיחות
        </Typography>
        <Paper elevation={3} style={{ padding: 20 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="שם לקוח"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="אימייל לקוח"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              margin="normal"
            />
            <Box my={2}>
              <input
                accept="audio/*"
                type="file"
                onChange={handleFileChange}
                style={{ marginBottom: 20 }}
              />
            </Box>
            <Typography variant="h6" gutterBottom>
              שאלות רגולטוריות
            </Typography>
            {questions.map((question, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={answers[index] || false}
                    onChange={() => handleAnswerChange(index)}
                    color="primary"
                  />
                }
                label={question}
              />
            ))}
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!file || !clientName || !clientEmail}
              >
                שמור שיחה
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;