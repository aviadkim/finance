const config = {
  port: process.env.PORT || 3000,
  speechToText: {
    languages: {
      hebrew: {
        code: 'he-IL',
        enableAutomaticPunctuation: true
      },
      english: {
        code: 'en-US',
        enableAutomaticPunctuation: true
      }
    }
  }
};

module.exports = config;