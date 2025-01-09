// Add this import
import EmailService from '../../services/EmailService';

// Add this function to the MeetingInterface component
const sendMeetingSummary = async () => {
  const answeredQuestions = formData.questions.filter(q => q.answer);
  
  try {
    await EmailService.sendMeetingSummary({
      clientEmail: formData.clientInfo.email,
      clientName: formData.clientInfo.name,
      meetingDate: formData.clientInfo.date,
      summary: formData.summary,
      questions: answeredQuestions,
      recommendations: formData.recommendations || [],
      nextMeeting: formData.nextMeeting
    });

    alert('סיכום נשלח בהצלחה');
  } catch (error) {
    console.error('Error sending summary:', error);
    alert('שגיאה בשליחת הסיכום');
  }
};

// Add email input to client info section
<div className="form-group">
  <label>אימייל לקוח</label>
  <input
    type="email"
    placeholder="הכנס אימייל"
    value={formData.clientInfo.email}
    onChange={(e) => setFormData(prev => ({
      ...prev,
      clientInfo: { ...prev.clientInfo, email: e.target.value }
    }))}
  />
</div>

// Add send summary button to summary section
<button 
  className="send-summary-btn"
  onClick={sendMeetingSummary}
  disabled={!formData.clientInfo.email || !formData.summary}
>
  שלח סיכום ללקוח
</button>