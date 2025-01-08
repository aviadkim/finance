const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket(process.env.FIREBASE_BUCKET);

async function saveAudioFile(audioBuffer, filename) {
  const file = bucket.file(`recordings/${filename}`);
  await file.save(audioBuffer);
  return file.publicUrl();
}

async function saveTranscript(transcript, filename) {
  const file = bucket.file(`transcripts/${filename}`);
  await file.save(JSON.stringify(transcript));
  return file.publicUrl();
}

async function getRecordingsList() {
  const [files] = await bucket.getFiles({ prefix: 'recordings/' });
  return files.map(file => ({
    name: file.name,
    url: file.publicUrl(),
    created: file.metadata.timeCreated
  }));
}

module.exports = {
  saveAudioFile,
  saveTranscript,
  getRecordingsList
};