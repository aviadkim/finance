
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class RegulatoryService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.questionsPath = path.join(__dirname, '../../../config/regulatory-questions.json');
  }

  async loadQuestions() {
    try {
      const data = await fs.readFile(this.questionsPath, 'utf8');
      return JSON.parse(data).regulatoryQuestions;
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  }

  async analyzeTranscript(transcript) {
    const questions = await this.loadQuestions();
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a financial regulatory compliance analyzer. Analyze the conversation transcript for compliance with regulatory requirements. Questions to check: ${JSON.stringify(questions)}`
          },
          {
            role: "user",
            content: transcript
          }
        ]
      });

      const analysis = completion.choices[0].message.content;
      return this.parseAnalysis(analysis, questions);
    } catch (error) {
      console.error('Analysis error:', error);
      return {
        answers: {},
        issues: [],
        recommendations: []
      };
    }
  }

  parseAnalysis(analysis, questions) {
    // Parse AI response to structured data
    const answers = {};
    const issues = [];
    const recommendations = [];

    questions.forEach(q => {
      const isAnswered = analysis.toLowerCase().includes(q.question.toLowerCase());
      answers[q.id] = isAnswered;
      
      if (!isAnswered) {
        issues.push({
          type: 'missing_question',
          description: `שאלה חסרה: ${q.question}`,
          severity: q.required ? 'high' : 'medium'
        });
      }
    });

    return {
      answers,
      issues,
      recommendations
    };
  }
}

module.exports = new RegulatoryService();
