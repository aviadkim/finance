import React, { useState } from 'react';
import EmailService from '../../services/EmailService';

const MeetingInterface = () => {
  const [formData, setFormData] = useState({
    clientInfo: {
      name: '',
      email: '',
      date: '',
    },
    summary: '',
    recommendations: '',
    nextMeeting: '',
    questions: [],
  });

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
        nextMeeting: formData.nextMeeting,
      });
      alert('סיכום נשלח בהצלחה');
    } catch (error) {
      console.error('Error sending summary:', error);
      alert('שגיאה בשליחת הסיכום');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-right">מערכת ניהול פיננסי</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-right">הקלטות פגישות</h2>
          <div className="flex space-x-4">
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 ml-4"
            >
              העלה הקלטה
            </label>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              התחל הקלטה
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Existing meeting type items */}
        </div>

        <div className="text-center text-2xl font-mono mb-4">
          00:00
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-right">תמלולים</h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            התחל הקלטה
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="mb-4">
          <label>שם לקוח</label>
          <input
            type="text"
            placeholder="הכנס שם לקוח"
            value={formData.clientInfo.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              clientInfo: { ...prev.clientInfo, name: e.target.value },
            }))}
          />
        </div>
        <div className="form-group">
          <label>תאריך פגישה</label>
          <input
            type="date"
            value={formData.clientInfo.date}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              clientInfo: { ...prev.clientInfo, date: e.target.value },
            }))}
          />
        </div>
        <div className="form-group">
          <label>אימייל לקוח</label>
          <input
            type="email"
            placeholder="הכנס אימייל"
            value={formData.clientInfo.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              clientInfo: { ...prev.clientInfo, email: e.target.value },
            }))}
          />
        </div>
        <div className="form-group">
          <label>סיכום הפגישה</label>
          <textarea
            placeholder="הכנס סיכום של הפגישה"
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              summary: e.target.value,
            }))}
          ></textarea>
        </div>
        <div className="form-group">
          <label>המלצות</label>
          <textarea
            placeholder="הכנס המלצות"
            value={formData.recommendations}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              recommendations: e.target.value,
            }))}
          ></textarea>
        </div>
        <div className="form-group">
          <label>פגישה הבאה</label>
          <input
            type="date"
            value={formData.nextMeeting}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              nextMeeting: e.target.value,
            }))}
          />
        </div>
        <button
          className="send-summary-btn bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={sendMeetingSummary}
          disabled={!formData.clientInfo.email || !formData.summary}
        >
          שלח סיכום ללקוח
        </button>
      </div>
    </div>
  );
};

export default MeetingInterface;
