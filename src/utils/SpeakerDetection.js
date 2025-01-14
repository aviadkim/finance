class SpeakerDetection {
  constructor() {
    this.speakers = new Map();
    this.colors = [
      'bg-blue-50',   // כחול בהיר
      'bg-green-50',  // ירוק בהיר
      'bg-purple-50', // סגול בהיר
      'bg-orange-50', // כתום בהיר
      'bg-pink-50',   // ורוד בהיר
      'bg-teal-50',   // טורקיז בהיר
    ];
    this.nextColorIndex = 0;
  }

  // זיהוי דובר לפי מאפיינים
  detectSpeaker(audioFeatures) {
    // TODO: להוסיף לוגיקה של זיהוי קול אמיתי
    return 'דובר ' + (this.speakers.size + 1);
  }

  // קבלת צבע לדובר
  getSpeakerColor(speakerId) {
    if (!this.speakers.has(speakerId)) {
      this.speakers.set(speakerId, this.colors[this.nextColorIndex % this.colors.length]);
      this.nextColorIndex++;
    }
    return this.speakers.get(speakerId);
  }

  // קבלת כל הדוברים וצבעיהם
  getAllSpeakers() {
    return Array.from(this.speakers.entries()).map(([id, color]) => ({
      id,
      color,
      messageCount: 0 // יכול לשמש למעקב אחרי כמות ההודעות של כל דובר
    }));
  }

  // איפוס המערכת
  reset() {
    this.speakers.clear();
    this.nextColorIndex = 0;
  }
}

export default SpeakerDetection;