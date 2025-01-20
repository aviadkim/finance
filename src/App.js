import React from 'react';
import ClientList from './components/ClientList';
import TranscriptManager from './components/TranscriptManager';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 text-right">
            מערכת ניהול פגישות
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6">
          {/* מערכת הקלטה ותמלול */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-right">הקלטות פגישות</h2>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
                >
                  העלה הקלטה
                </label>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  התחל הקלטה
                </button>
              </div>
            </div>

            {/* סוגי שיחות */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">שיחת היכרות ראשונית</h3>
                <p className="text-sm text-gray-600">מטרת שיחה זו היא להכיר את הלקוח...</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">שיחת עדכון צרכים שוטף</h3>
                <p className="text-sm text-gray-600">מטרת שיחה זו היא לוודא שמדיניות...</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">שיחת שיווק שוטפת</h3>
                <p className="text-sm text-gray-600">מטרת שיחה זו היא לתת מענה לצרכים...</p>
              </div>
            </div>
          </section>

          {/* ניהול לקוחות */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-right">ניהול לקוחות</h2>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                + לקוח חדש
              </button>
            </div>
            <ClientList />
          </section>

          {/* תמלולים */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-right">תמלולים</h2>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                התחל תמלול
              </button>
            </div>
            <TranscriptManager />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;