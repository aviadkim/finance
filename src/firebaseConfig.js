import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyA3_P5wiusfFvo7_fzCO4_1BsyW22u81Eg',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'finance-5039e.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'finance-5039e',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'finance-5039e.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '469463361313',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:469463361313:web:ffbf9f0f343228bc16c060',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-R14W1WWB0N'
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };