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
      context: ''
    }))
  }));
}

export function checkTranscriptForQuestions(transcript, currentQuestions) {
  return currentQuestions.map(category => ({
    ...category,
    questions: category.questions.map(question => {
      const isDiscussed = question.keywords.some(keyword =>
        transcript.toLowerCase().includes(keyword.toLowerCase())
      );
      
      let context = '';
      if (isDiscussed) {
        const matchingKeyword = question.keywords.find(keyword =>
          transcript.toLowerCase().includes(keyword.toLowerCase())
        );
        const sentences = transcript.split('.');
        const relevantSentence = sentences.find(sentence =>
          sentence.toLowerCase().includes(matchingKeyword.toLowerCase())
        );
        context = relevantSentence ? relevantSentence.trim() : '';
      }

      return {
        ...question,
        discussed: isDiscussed || question.discussed,
        context: context || question.context,
        checked: isDiscussed || question.checked
      };
    })
  }));
}