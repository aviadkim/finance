
const RecordingService = require('../services/RecordingService');
const RegulatoryService = require('../services/RegulatoryService');
const { v4: uuidv4 } = require('uuid');

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected');
    let currentSessionId = null;

    socket.on('start_recording', async (clientData) => {
      try {
        currentSessionId = uuidv4();
        await RecordingService.initializeSession(currentSessionId);
        socket.emit('recording_started', { sessionId: currentSessionId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to start recording' });
      }
    });

    socket.on('audio_chunk', async (data) => {
      if (!currentSessionId) return;

      try {
        const transcriptUpdate = await RecordingService.processAudioChunk(
          currentSessionId,
          data.chunk
        );

        if (transcriptUpdate) {
          // Analyze updated transcript
          const analysis = await RegulatoryService.analyzeTranscript(transcriptUpdate);
          
          socket.emit('transcript_update', {
            text: transcriptUpdate,
            analysis
          });
        }
      } catch (error) {
        console.error('Error processing audio chunk:', error);
      }
    });

    socket.on('stop_recording', async () => {
      if (!currentSessionId) return;

      try {
        const result = await RecordingService.finalizeSession(currentSessionId);
        const finalAnalysis = await RegulatoryService.analyzeTranscript(result.transcript);

        socket.emit('recording_complete', {
          ...result,
          analysis: finalAnalysis
        });

        currentSessionId = null;
      } catch (error) {
        socket.emit('error', { message: 'Failed to stop recording' });
      }
    });

    socket.on('disconnect', () => {
      if (currentSessionId) {
        RecordingService.finalizeSession(currentSessionId)
          .catch(console.error);
      }
    });
  });
};

module.exports = setupSocketHandlers;
