import React, { useEffect, useCallback } from 'react';

const RegulatoryFramework = ({ transcript }) => {
  const processTranscript = useCallback((text) => {
    // הלוגיקה הקיימת נשארת
  }, []);

  useEffect(() => {
    if (transcript) {
      processTranscript(transcript);
    }
  }, [transcript, processTranscript]); // הוספנו את processTranscript לתלויות

  return (
    // הרינדור הקיים נשאר
  );
};

export default RegulatoryFramework;