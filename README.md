# Finance System

מערכת לניהול שיחות ותיעוד רגולטורי

[![Deploy to GitHub Pages](https://github.com/aviadkim/finance/actions/workflows/deploy.yml/badge.svg)](https://github.com/aviadkim/finance/actions/workflows/deploy.yml)

## Development Tools

ניתן לפתח את המערכת באמצעות הכלים הבאים:

1. **GitHub Codespaces**:
   - לחץ על `.` (נקודה) בדף הראשי של הריפוזיטורי
   - או לחץ על Code > Codespaces > New codespace

2. **GitHub Pages**:
   - צפה באפליקציה בכתובת: https://aviadkim.github.io/finance/

3. **GitHub Actions**:
   - בדיקות אוטומטיות ופריסה ל-Pages
   - צפה בתוצאות בלשונית Actions

## Development

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### Working with GitHub Codespaces

1. פתח את הריפוזיטורי ב-Codespaces
2. התקן את התלויות:
```bash
cd frontend && npm install
```
3. הרץ את הפרויקט:
```bash
npm start
```

## Deployment

הפריסה מתבצעת אוטומטית ל-GitHub Pages בכל push לענף main.

## טכנולוגיות

- React.js
- Material-UI
- GitHub Actions
- GitHub Pages
- GitHub Codespaces