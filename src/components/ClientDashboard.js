import React from 'react';

const ClientDashboard = ({ client }) => {
  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-600">בחר לקוח להצגת מידע</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">סך השקעות</h3>
          <div className="text-2xl font-bold">₪1,250,000</div>
          <div className="text-sm text-green-600">+5.2% החודש</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">פגישה אחרונה</h3>
          <div className="text-xl">15/12/2024</div>
          <div className="text-sm text-gray-500">עדכון צרכים רבעוני</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">משימות פתוחות</h3>
          <div className="text-xl">3</div>
          <div className="text-sm text-red-500">2 דחופות</div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">סיכום תיק השקעות</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">הקצאת נכסים</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>מניות</span>
                <span>60%</span>
              </div>
              <div className="flex justify-between">
                <span>אג"ח</span>
                <span>30%</span>
              </div>
              <div className="flex justify-between">
                <span>מזומן</span>
                <span>10%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">פיזור גיאוגרפי</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>ישראל</span>
                <span>40%</span>
              </div>
              <div className="flex justify-between">
                <span>ארה"ב</span>
                <span>35%</span>
              </div>
              <div className="flex justify-between">
                <span>אירופה</span>
                <span>25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">פגישות אחרונות</h3>
        <div className="space-y-4">
          {[
            { date: '15/12/2024', type: 'עדכון צרכים רבעוני', summary: 'עדכון הקצאת נכסים והגדלת חשיפה למניות' },
            { date: '01/11/2024', type: 'סקירת תיק', summary: 'סקירת ביצועים ודיון באסטרטגיה' },
            { date: '15/09/2024', type: 'פגישת היכרות', summary: 'הגדרת פרופיל סיכון ומטרות השקעה' }
          ].map((meeting, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">{meeting.date}</div>
                <div className="text-sm text-blue-600">{meeting.type}</div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{meeting.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;