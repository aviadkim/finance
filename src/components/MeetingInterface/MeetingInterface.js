import React, { useState } from 'react';

const MeetingInterface = () => {
  const initialMeetingTypes = [
    {
      id: 'initial',
      title: 'שיחת היכרות\nראשונית',
      description: 'מטרת שיחה זו היא\nלהכיר את הלקוח...',
    },
    {
      id: 'update',
      title: 'שיחת עדכון\nצרכים שוטף',
      description: 'מטרת שיחה זו היא\nלוודא שמדיניות...',
    },
    {
      id: 'marketing',
      title: 'שיחת שיווק\nשוטפת',
      description: 'מטרת שיחה זו היא\nלתת מענה לצרכים...',
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-right">מערכת ניהול פיננסי</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-right">הקלטות פגישות</h2>
          <div className="flex items-center space-x-4">
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
          {initialMeetingTypes.map((type) => (
            <div key={type.id} className="bg-gray-50 p-4 rounded-lg text-right">
              <h3 className="font-semibold whitespace-pre-line">{type.title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">{type.description}</p>
            </div>
          ))}
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
    </div>
  );
};

export default MeetingInterface;