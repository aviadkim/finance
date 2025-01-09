const admin = require('firebase-admin');

const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  }
  return admin;
};

module.exports = { initializeFirebase };