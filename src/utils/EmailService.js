export const sendTranscriptEmail = async (summary) => {
  // בשלב זה זה מוק של שליחת מייל - נחבר לשירות אמיתי בהמשך
  console.log('Sending email with summary:', summary);
  
  const emailContent = `
    <h2>סיכום פגישה</h2>
    
    <h3>נושאים שנדונו:</h3>
    <ul>
      ${summary.topics.map(topic => `<li>${topic}</li>`).join('')}
    </ul>

    <h3>נקודות עיקריות:</h3>
    <ul>
      ${summary.mainPoints.map(point => `<li>${point}</li>`).join('')}
    </ul>

    <h3>משימות להמשך:</h3>
    <ul>
      ${summary.actionItems.map(item => `<li>${item}</li>`).join('')}
    </ul>
  `;

  // TODO: התחבר לשירות מייל אמיתי
  return {
    success: true,
    message: 'Email sent successfully',
    content: emailContent
  };
};
