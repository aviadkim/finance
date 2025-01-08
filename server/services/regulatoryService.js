const questions = require('../config/questions.json');

async function analyzeCompliance(transcript) {
  const results = {
    questions: [],
    completionRate: 0,
    missingQuestions: []
  };

  for (const category of questions.regulatoryQuestions) {
    const questionResults = category.questions.map(question => {
      const isAsked = transcript.toLowerCase().includes(question.text.toLowerCase());
      return {
        id: question.id,
        text: question.text,
        asked: isAsked,
        required: question.required,
        category: category.name
      };
    });

    results.questions.push(...questionResults);
  }

  const requiredQuestions = results.questions.filter(q => q.required);
  const answeredRequired = requiredQuestions.filter(q => q.asked);
  results.completionRate = (answeredRequired.length / requiredQuestions.length) * 100;
  results.missingQuestions = requiredQuestions.filter(q => !q.asked);

  return results;
}

module.exports = { analyzeCompliance };