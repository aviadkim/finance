# Finance System

מערכת לניהול שיחות ותיעוד רגולטורי

## התקנה

### Backend

1. התקן את הספריות הנדרשות:
```bash
cd backend
npm install
```

2. העתק את קובץ הסביבה:
```bash
cp .env.example .env
```

3. ערוך את קובץ .env עם הפרטים שלך

4. הפעל את השרת:
```bash
npm run dev
```

### Frontend

1. התקן את הספריות הנדרשות:
```bash
cd frontend
npm install
```

2. הפעל את הממשק:
```bash
npm start
```

## תכונות

* הקלטת שיחות בזמן אמת
* תמלול אוטומטי
* שאלות רגולטוריות
* שמירה ב-Firebase או Google Drive
* שליחת דו"ח PDF ללקוח

## דרישות מערכת

* Node.js 14 ומעלה
* חשבון Firebase
* חשבון Google Drive API