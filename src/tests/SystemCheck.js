export const runSystemCheck = async () => {
  const checks = [
    checkFirebaseConnection(),
    checkRecordingFeatures(),
    checkTranscriptionFeatures(),
    checkSummaryFeatures(),
    checkEmailFeatures()
  ];

  const results = await Promise.all(checks);
  return formatResults(results);
};

const checkFirebaseConnection = async () => {
  try {
    const db = window.firebase?.firestore();
    if (!db) return { name: 'Firebase Connection', status: 'FAIL', error: 'No Firebase instance' };
    
    await db.collection('tests').doc('test').set({ timestamp: new Date() });
    return { name: 'Firebase Connection', status: 'PASS' };
  } catch (error) {
    return { name: 'Firebase Connection', status: 'FAIL', error: error.message };
  }
};

const checkRecordingFeatures = async () => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      return { name: 'Recording Features', status: 'FAIL', error: 'MediaDevices not supported' };
    }
    return { name: 'Recording Features', status: 'PASS' };
  } catch (error) {
    return { name: 'Recording Features', status: 'FAIL', error: error.message };
  }
};

const checkTranscriptionFeatures = () => {
  if (!window.webkitSpeechRecognition) {
    return { name: 'Transcription Features', status: 'FAIL', error: 'SpeechRecognition not supported' };
  }
  return { name: 'Transcription Features', status: 'PASS' };
};

const checkSummaryFeatures = async () => {
  try {
    const testTranscript = [
      { text: 'צריך לבדוק את תיק ההשקעות', speaker: 'יועץ' },
      { text: 'חשוב לציין שנדרש עדכון בפוליסה', speaker: 'יועץ' }
    ];
    
    const summarizer = new window.MeetingSummarizer(testTranscript);
    const summary = await summarizer.analyze();
    
    if (!summary?.topics || !summary?.mainPoints) {
      return { name: 'Summary Features', status: 'FAIL', error: 'Summary missing required fields' };
    }
    return { name: 'Summary Features', status: 'PASS' };
  } catch (error) {
    return { name: 'Summary Features', status: 'FAIL', error: error.message };
  }
};

const checkEmailFeatures = async () => {
  try {
    const testSummary = {
      topics: ['השקעות'],
      mainPoints: ['נקודה חשובה'],
      actionItems: ['משימה לביצוע']
    };
    
    const result = await window.sendTranscriptEmail(testSummary);
    if (!result?.success) {
      return { name: 'Email Features', status: 'FAIL', error: 'Email sending failed' };
    }
    return { name: 'Email Features', status: 'PASS' };
  } catch (error) {
    return { name: 'Email Features', status: 'FAIL', error: error.message };
  }
};

const formatResults = (results) => {
  return {
    timestamp: new Date().toISOString(),
    allPassed: results.every(r => r.status === 'PASS'),
    results: results,
    summary: `${results.filter(r => r.status === 'PASS').length}/${results.length} checks passed`
  };
};
