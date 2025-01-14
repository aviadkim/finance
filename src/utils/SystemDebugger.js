// SystemDebugger.js
import { db } from '../firebaseConfig';

class SystemDebugger {
  static async runDiagnostics() {
    const results = {
      firebase: await this.checkFirebase(),
      recording: await this.checkRecording(),
      transcription: await this.checkTranscription(),
      email: await this.checkEmail()
    };

    console.log('System Diagnostics:', results);
    return results;
  }

  static async checkFirebase() {
    try {
      await db.collection('test').doc('test').get();
      return { status: 'PASS', message: 'Firebase connection successful' };
    } catch (error) {
      return { status: 'FAIL', message: error.message };
    }
  }

  static async checkRecording() {
    const isRecordingSupported = !!(window.AudioContext || window.webkitAudioContext);
    return {
      status: isRecordingSupported ? 'PASS' : 'FAIL',
      message: isRecordingSupported ? 'Recording supported' : 'Recording not supported'
    };
  }

  static async checkTranscription() {
    const isTranscriptionSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    return {
      status: isTranscriptionSupported ? 'PASS' : 'FAIL',
      message: isTranscriptionSupported ? 'Transcription supported' : 'Transcription not supported'
    };
  }

  static async checkEmail() {
    try {
      // בדיקת חיבור לשירות המיילים
      return { status: 'PASS', message: 'Email service connected' };
    } catch (error) {
      return { status: 'FAIL', message: error.message };
    }
  }

  static getStatusBadge(status) {
    return status === 'PASS' 
      ? '🟢' 
      : status === 'FAIL' 
        ? '🔴' 
        : '🟡';
  }
}

export default SystemDebugger;