import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const MeetingDetailsModal = ({ meeting, client, onClose }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    type: '',
    primaryTopic: '',
    actionItems: [],
    nextMeetingDate: null
  });

  const handleSave = async () => {
    if (!client) {
      alert('אנא בחר לקוח');
      return;
    }

    try {
      // Save meeting details to Firestore
      await addDoc(collection(db, 'clients', client.id, 'meetings'), {
        ...meeting,
        details: meetingDetails,
        savedAt: new Date()
      });

      alert('פרטי הפגישה נשמרו בהצלחה');
      onClose();
    } catch (error) {
      console.error('שגיאה בשמירת פרטי פגישה:', error);
      alert('לא ניתן היה לשמור את פרטי הפגישה');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">פרטי פגישה</h2>
        
        {/* Meeting Type */}
        <div className="mb-4">
          <label className="block mb-2">סוג פגישה</label>
          <select
            value={meetingDetails.type}
            onChange={(e) => setMeetingDetails(prev => ({
              ...prev, 
              type: e.target.value
            }))}
            className="w-full p-2 border rounded"
          >
            <option value="">בחר סוג פגישה</option>
            <option value="investment_consultation">ייעוץ השקעות</option>
            <option value="financial_review">סקירה פיננסית</option>
            <option value="portfolio_management">ניהול תיק השקעות</option>
          </select>
        </div>

        {/* Primary Topic */}
        <div className="mb-4">
          <label className="block mb-2">נושא עיקרי</label>
          <input
            type="text"
            value={meetingDetails.primaryTopic}
            onChange={(e) => setMeetingDetails(prev => ({
              ...prev, 
              primaryTopic: e.target.value
            }))}
            className="w-full p-2 border rounded"
            placeholder="הזן נושא עיקרי"
          />
        </div>

        {/* Action Items */}
        <div className="mb-4">
          <label className="block mb-2">משימות להמשך</label>
          <textarea
            value={meetingDetails.actionItems.join('\n')}
            onChange={(e) => setMeetingDetails(prev => ({
              ...prev, 
              actionItems: e.target.value.split('\n')
            }))}
            className="w-full p-2 border rounded"
            placeholder="הזן משימות, כל משימה בשורה חדשה"
            rows="4"
          />
        </div>

        {/* Next Meeting Date */}
        <div className="mb-4">
          <label className="block mb-2">מועד פגישה הבאה</label>
          <input
            type="date"
            value={meetingDetails.nextMeetingDate || ''}
            onChange={(e) => setMeetingDetails(prev => ({
              ...prev, 
              nextMeetingDate: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            שמור פרטי פגישה
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;