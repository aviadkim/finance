const analyzeCompliance = async (transcript) => {
  const questions = require('../config/questions.json');
  const results = [];

  for (const question of questions.regulatoryQuestions) {
    const found = transcript.toLowerCase().includes(question.question.toLowerCase());
    results.push({
      id: question.id,
      question: question.question,
      asked: found,
      timestamp: found ? new Date().toISOString() : null
    });
  }

  return results;
};

module.exports = { analyzeCompliance };