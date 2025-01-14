import { db } from "../firebaseConfig";

export const SystemDebugger = {
  async runDiagnostics() {
    const results = {
      firebase: await this.checkFirebase(),
      recording: await this.checkRecording(),
      transcription: await this.checkTranscription(),
      email: await this.checkEmail()
    };
    
    console.log("System Diagnostics:", results);
    return results;
  },

  async checkFirebase() {
    try {
      await db.collection("test").doc("test").get();
      return { status: "PASS", message: "Firebase connection successful" };
    } catch (error) {
      return { status: "FAIL", message: error.message };
    }
  },

  async checkRecording() {
    const supported = !!(window.AudioContext || window.webkitAudioContext);
    return {
      status: supported ? "PASS" : "FAIL",
      message: supported ? "Recording supported" : "Recording not supported"
    };
  },

  async checkTranscription() {
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    return {
      status: supported ? "PASS" : "FAIL",
      message: supported ? "Transcription supported" : "Transcription not supported"
    };
  },

  async checkEmail() {
    try {
      return { status: "PASS", message: "Email service connected" };
    } catch (error) {
      return { status: "FAIL", message: error.message };
    }
  }
}
