const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const analyzeConversation = async (transcript) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are analyzing a conversation between a financial advisor and a client.
            Identify:
            1. Regulatory questions asked and answered
            2. Client responses
            3. Advisor recommendations
            4. Important points for summary
            5. Any compliance issues
            
            Format the response in JSON with these keys:
            - questions: array of {question, answered, timestamp}
            - recommendations: array of strings
            - summary: string
            - complianceIssues: array of strings or empty array
            `
        },
        { role: "user", content: transcript }
      ]
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing conversation:', error);
    throw error;
  }
};

module.exports = { analyzeConversation };