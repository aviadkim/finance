export const regulatoryCategories = [
  {
    id: 1,
    title: 'מידע אודות הלקוח',
    questions: [
      {
        id: '1.1',
        text: 'האם נבחנה רמת הידע והניסיון בשוק ההון?',
        keywords: ['ידע', 'ניסיון', 'השקעות']
      },
      {
        id: '1.2',
        text: 'האם נבחנה היכרות עם סוגי נכסים פיננסיים?',
        keywords: ['נכסים', 'מכשירים', 'היכרות']
      }
    ]
  },
  {
    id: 2,
    title: 'מטרות והעדפות',
    questions: [
      {
        id: '2.1',
        text: 'האם נבחנו מטרות הלקוח לטווח הקצר והארוך?',
        keywords: ['מטרות', 'טווח', 'תכנון']
      },
      {
        id: '2.2',
        text: 'האם נבחנה העדפת סיכון?',
        keywords: ['סיכון', 'העדפה', 'רמת סיכון']
      }
    ]
  },
  {
    id: 3,
    title: 'מצב פיננסי',
    questions: [
      {
        id: '3.1',
        text: 'האם נבחנה הכנסה שוטפת והתחייבויות?',
        keywords: ['הכנסה', 'התחייבויות', 'כספים']
      },
      {
        id: '3.2',
        text: 'האם נבחנו נכסים קיימים והשקעות?',
        keywords: ['נכסים', 'השקעות', 'רכוש']
      }
    ]
  },
  {
    id: 4,
    title: 'צרכים מיוחדים',
    questions: [
      {
        id: '4.1',
        text: 'האם קיימים צרכים מיוחדים לטווח הקצר?',
        keywords: ['צרכים', 'מיוחדים', 'טווח קצר']
      },
      {
        id: '4.2',
        text: 'האם נבחנו תכניות לטווח הארוך?',
        keywords: ['תכניות', 'טווח ארוך', 'עתיד']
      }
    ]
  },
  {
    id: 5,
    title: 'שיקולים מיוחדים',
    questions: [
      {
        id: '5.1',
        text: 'האם קיימים שיקולי מיסוי?',
        keywords: ['מס', 'מיסוי', 'מסים']
      },
      {
        id: '5.2',
        text: 'האם קיימים שיקולים משפטיים?',
        keywords: ['משפטי', 'חוקי', 'הסכם']
      }
    ]
  }
];

export function initializeQuestions() {
  return regulatoryCategories.map(category => ({
    ...category,
    questions: category.questions.map(q => ({
      ...q,
      discussed: false,
      checked: false,
      context: '',
      timestamp: null
    }))
  }));
}

function findRelevantContext(transcript, keyword, maxWords = 15) {
  const sentences = transcript.split(/[.!?]\s+/);
  const relevantSentences = sentences.filter(sentence => 
    sentence.toLowerCase().includes(keyword.toLowerCase())
  );

  if (relevantSentences.length === 0) return null;

  // Get the most relevant sentence
  const bestSentence = relevantSentences.reduce((best, current) => {
    const keywordIndex = current.toLowerCase().indexOf(keyword.toLowerCase());
    const words = current.split(/\s+/);
    if (words.length <= maxWords) return current;

    // Extract context around the keyword
    const startIndex = Math.max(0, keywordIndex - Math.floor(maxWords/2));
    const endIndex = Math.min(current.length, keywordIndex + Math.floor(maxWords/2));
    return current.substring(startIndex, endIndex);
  }, '');

  return bestSentence.trim();
}

export function checkTranscriptForQuestions(transcript, currentQuestions, currentTime) {
  return currentQuestions.map(category => ({
    ...category,
    questions: category.questions.map(question => {
      const matchingKeyword = question.keywords.find(keyword =>
        transcript.toLowerCase().includes(keyword.toLowerCase())
      );

      if (!matchingKeyword) {
        return question;
      }

      const relevantContext = findRelevantContext(transcript, matchingKeyword);
      const timestamp = currentTime || new Date().toLocaleTimeString();

      return {
        ...question,
        discussed: true,
        context: relevantContext || question.context,
        checked: true,
        timestamp
      };
    })
  }));
}