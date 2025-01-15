import { initialQuestions } from './initialQuestions';
import { updateQuestions } from './updateQuestions';
import { marketingQuestions } from './marketingQuestions';

export const regulatoryCategories = [
  initialQuestions,
  updateQuestions,
  marketingQuestions
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
  const sentences = transcript.split(/[.!?\u05d0-\u05ea]\s+/);
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
      const timestamp = currentTime || new Date().toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

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