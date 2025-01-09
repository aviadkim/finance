// Add this import at the top
import WhisperService from '../../services/WhisperService';

// Inside MeetingInterface component, add this function:
  const startRecordingWithWhisper = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start Whisper transcription
      const mediaRecorder = await WhisperService.transcribeLive(stream, (transcript) => {
        setTranscript(prev => prev + ' ' + transcript);
        processLiveTranscript(transcript);
      });

      setMediaRecorder(mediaRecorder);
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording with Whisper:', error);
      alert('שגיאה בהתחלת ההקלטה');
    }
  };

  // Replace the old stopRecording function with:
  const stopRecordingWithWhisper = async () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsAnalyzing(true);

      try {
        // Get the final audio blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Get full transcript from Whisper
        const finalTranscript = await WhisperService.transcribeAudio(audioBlob, (progress) => {
          console.log(`Transcription progress: ${progress}%`);
        });

        // Process with ChatGPT
        const analysis = await AIService.analyzeConversation(finalTranscript);
        
        // Update the form
        updateFormWithAnalysis(analysis);

      } catch (error) {
        console.error('Error processing recording:', error);
        alert('שגיאה בעיבוד ההקלטה');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };