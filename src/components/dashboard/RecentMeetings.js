import React from 'react';
import { useClient } from '../../contexts/ClientContext';

const RecentMeetings = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">פגישות אחרונות</h3>
      <div className="space-y-4">
        {[
          { date: '15/12/2024', type: 'עדכון צרכים' },
          { date: '01/11/2024', type: 'סקירת תיק' }
        ].map((meeting, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="text-sm">{meeting.date}</div>
            <div className="text-sm text-blue-600">{meeting.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};