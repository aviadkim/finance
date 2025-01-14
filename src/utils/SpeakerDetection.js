export const speakerColors = {
  speaker1: '#E57373', // Light Red
  speaker2: '#64B5F6', // Light Blue
  speaker3: '#81C784', // Light Green
  speaker4: '#FFB74D', // Light Orange
};

export const SpeakerDetection = {
  identifySpeaker: (audioSegment) => {
    // For now, return a random speaker ID
    return {
      speakerId: `speaker${Math.floor(Math.random() * 4) + 1}`,
      confidence: 0.95
    };
  },
  
  getColorForSpeaker: (speakerId) => {
    return speakerColors[speakerId] || '#9E9E9E';
  }
};