import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH5dVh9kYjIgZU9dI2UcpQ6pTIKDPfXZM",
  authDomain: "finance-5039e.firebaseapp.com",
  projectId: "finance-5039e",
  storageBucket: "finance-5039e.appspot.com",
  messagingSenderId: "903837426191",
  appId: "1:903837426191:web:b99d9c0162415f31cd7856"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, storage, googleProvider };