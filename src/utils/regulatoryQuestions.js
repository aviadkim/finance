export const regulatoryCategories = [
  // ... categories as before ...
];

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
      const questionTime = currentTime || new Date().toLocaleTimeString();

      return {
        ...question,
        discussed: true,
        context: relevantContext || question.context,
        checked: true,
        timestamp: questionTime
      };
    })
  }));
}