const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class RegulatoryAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.questionsPath = path.resolve(__dirname, '../../../config/regulatory-questions.json');
  }

  async loadRegulatoryQuestions() {
    try {
      const data = await fs.readFile(this.questionsPath, 'utf8');
      return JSON.parse(data).regulatoryQuestions;
    } catch (error) {
      console.error('Error loading regulatory questions:', error);
      return [];
    }
  }

  async analyzeTranscript(transcript) {
    const questions = await this.loadRegulatoryQuestions();
    
    const analysis = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `אתה עוזר ליועץ פיננסי לבדוק עמידה בדרישות רגולטוריות. 
          השתמש ברשימת השאלות הבאה כדי לנתח את השיחה:
          ${JSON.stringify(questions)}

          הערך את רמת הסיכון הרגולטורי וזהה סעיפים הדורשים תשומת לב נוספת.`
        },
        {
          role: "user",
          content: transcript
        }
      ]
    });

    const analysisResult = analysis.choices[0].message.content;

    return {
      rawAnalysis: analysisResult,
      riskLevel: this.determineRiskLevel(analysisResult),
      flaggedItems: this.extractFlaggedItems(analysisResult)
    };
  }

  determineRiskLevel(analysis) {
    const riskIndicators = {
      high: ['סיכון גבוה', 'חשש משמעותי', 'דורש טיפול מיידי'],
      medium: ['סיכון בינוני', 'דורש בחינה', 'טעון שיפור'],
      low: ['סיכון נמוך', 'עומד בדרישות']
    };

    for (const [level, indicators] of Object.entries(riskIndicators)) {
      if (indicators.some(indicator => analysis.includes(indicator))) {
        return level;
      }
    }

    return 'low';
  }

  extractFlaggedItems(analysis) {
    const flaggedKeywords = [
      'ניגוד עניינים',
      'גילוי לא מלא',
      'חסר מידע',
      'סטייה מנהלים',
      'צורך בבירור נוסף'
    ];

    return flaggedKeywords
      .filter(keyword => analysis.includes(keyword))
      .map(keyword => ({
        type: 'רגולטורי',
        description: `זוהה: ${keyword}`,
        severity: this.determineSeverity(keyword)
      }));
  }

  determineSeverity(keyword) {
    const severityMap = {
      'ניגוד עניינים': 'high',
      'גילוי לא מלא': 'high',
      'חסר מידע': 'medium',
      'סטייה מנהלים': 'high',
      'צורך בבירור נוסף': 'medium'
    };

    return severityMap[keyword] || 'low';
  }

  async generateComplianceReport(analysis) {
    const reportGeneration = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "צור דוח רגולטורי מפורט על בסיס ניתוח השיחה"
        },
        {
          role: "user",
          content: JSON.stringify(analysis)
        }
      ]
    });

    return reportGeneration.choices[0].message.content;
  }
}

module.exports = new RegulatoryAnalyzer();