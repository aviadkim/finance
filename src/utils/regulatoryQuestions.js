export const regulatoryQuestions = [
  {
    id: 1,
    text: 'האם חל שינוי בצרכי הלקוח?',
    keywords: ['צרכים', 'שינוי', 'העדפות', 'מצב', 'שינויים']
  },
  {
    id: 2,
    text: 'האם נדרש עדכון מדיניות השקעה?',
    keywords: ['מדיניות', 'השקעה', 'עדכון', 'שינוי', 'אסטרטגיה']
  },
  {
    id: 3,
    text: 'האם קיים ניגוד עניינים?',
    keywords: ['ניגוד', 'עניינים', 'אינטרס', 'התנגשות', 'בעיה']
  }
];

export function checkTranscriptForQuestions(transcript) {
  const results = regulatoryQuestions.map(question => {
    const isDiscussed = question.keywords.some(keyword =>
      transcript.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Find the specific context where the keyword was mentioned
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
      discussed: isDiscussed,
      context: context,
      checked: false
    };
  });

  return results;
}