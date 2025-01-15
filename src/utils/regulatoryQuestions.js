export const regulatoryCategories = [
  {
    id: 'initial',
    title: 'שיחת היכרות ראשונית',
    description: 'מטרת שיחה זו היא להכיר את הלקוח ולבסס את הצרכים והמטרות שלו.',
    questions: [
      {
        id: 'initial-1',
        text: 'ספר/י לי מעט על עצמך. מה הרקע שלך בשוק ההון?',
        keywords: [
          'רקע',
          'שוק ההון',
          'ניסיון',
          'ידע',
          'השקעות',
          'לימודים'
        ]
      },
      {
        id: 'initial-2',
        text: 'באילו סוגי נכסים פיננסיים אתה/את מכיר/ה?',
        keywords: [
          'נכסים',
          'פיננסיים',
          'קרנות',
          'מניות',
          'אגחים',
          'פקדונות',
          'קופות גמל',
          'השתלמות',
          'פנסיה'
        ]
      },
      {
        id: 'initial-3',
        text: 'מהן מטרות ההשקעה שלך? לטווח קצר? לטווח ארוך?',
        keywords: [
          'מטרות',
          'טווח',
          'קצר',
          'ארוך',
          'יעדים',
          'תכנון',
          'תשואה'
        ]
      },
      {
        id: 'initial-4',
        text: 'מהי רמת הסיכון שאתה/את מוכן/ה לקחת?',
        keywords: [
          'סיכון',
          'תנודתיות',
          'הפסד',
          'רווח',
          'סיכוי',
          'סיכונים'
        ]
      },
      {
        id: 'initial-5',
        text: 'מהי ההכנסה החודשית שלך והאם יש לך התחייבויות כספיות משמעותיות?',
        keywords: [
          'הכנסה',
          'משכורת',
          'התחייבויות',
          'הלוואות',
          'משכנתא',
          'חובות'
        ]
      },
      {
        id: 'initial-6',
        text: 'האם יש לך נכסים או השקעות קיימות?',
        keywords: [
          'נכסים',
          'השקעות',
          'חסכונות',
          'קופות',
          'נדלן'
        ]
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