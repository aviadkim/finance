import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2Ak5YzaXi_3QR4yQXtx9D9Y4k6lHvzJc",
  authDomain: "finance-bfc48.firebaseapp.com",
  projectId: "finance-bfc48",
  storageBucket: "finance-bfc48.appspot.com",
  messagingSenderId: "41592992981",
  appId: "1:41592992981:web:c016b47bfa7f13523c913f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
