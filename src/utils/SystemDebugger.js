export const SystemDebugger = {
  features: {
    recording: {
      liveRecording: { status: false, lastCheck: null },
      fileUpload: { status: false, lastCheck: null },
      audioFormats: { status: false, supported: [] }
    },
    transcription: {
      hebrew: { status: false, lastCheck: null },
      english: { status: false, lastCheck: null },
      multiSpeaker: { status: false, lastCheck: null }
    },
    speakerDetection: {
      colors: {
        hebrew: {
          advisor: '#E57373',
          client: '#64B5F6',
          others: ['#81C784', '#FFB74D']
        },
        english: {
          advisor: '#9575CD',
          client: '#4FC3F7',
          others: ['#FFF176', '#FF8A65']
        }
      },
      roles: { status: false, identified: [] }
    },
    summary: {
      automatic: { status: false, lastCheck: null },
      mainPoints: { status: false, lastCheck: null },
      decisions: { status: false, lastCheck: null }
    },
    email: {
      templates: { status: false, available: [] },
      sending: { status: false, lastCheck: null }
    }
  },

  testFeature: async (feature) => {
    try {
      switch(feature) {
        case 'recording.liveRecording':
          return testLiveRecording();
        case 'recording.fileUpload':
          return testFileUpload();
        case 'transcription.hebrew':
          return testHebrewTranscription();
        case 'transcription.english':
          return testEnglishTranscription();
        // וכו'
      }
    } catch (error) {
      console.error(`Feature test failed: ${feature}`, error);
      return false;
    }
  },

  updateFeatureStatus: (featurePath, status) => {
    const now = new Date();
    const pathParts = featurePath.split('.');
    let current = SystemDebugger.features;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = {
      status,
      lastCheck: now,
      history: [...(current[pathParts[pathParts.length - 1]].history || []), 
        { status, timestamp: now }]
    };
  },

  checkFeature: async (featurePath) => {
    try {
      const result = await SystemDebugger.testFeature(featurePath);
      SystemDebugger.updateFeatureStatus(featurePath, result);
      return result;
    } catch (error) {
      console.error(`Feature check failed: ${featurePath}`, error);
      return false;
    }
  },

  runAllChecks: async () => {
    const results = {
      working: [],
      failed: [],
      notTested: []
    };

    for (const category in SystemDebugger.features) {
      for (const feature in SystemDebugger.features[category]) {
        if (typeof SystemDebugger.features[category][feature] === 'object' 
            && SystemDebugger.features[category][feature].status !== undefined) {
          const status = await SystemDebugger.checkFeature(`${category}.${feature}`);
          if (status === true) {
            results.working.push(`${category}.${feature}`);
          } else if (status === false) {
            results.failed.push(`${category}.${feature}`);
          } else {
            results.notTested.push(`${category}.${feature}`);
          }
        }
      }
    }

    return results;
  }
};