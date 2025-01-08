const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');

class MeetingManager {
  constructor() {
    this.meetings = [];
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  startMeeting(userDetails) {
    const meetingId = uuidv4();
    const meeting = {
      id: meetingId,
      user: userDetails,
      startTime: new Date(),
      status: 'active',
      transcript: [],
      notes: [],
      regulatoryChecklist: []
    };

    this.meetings.push(meeting);
    return meetingId;
  }

  async addTranscriptChunk(meetingId, audioChunk) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) {
      throw new Error('פגישה לא נמצאה');
    }

    // תמלול קטע אודיו
    const transcription = await this.transcribeAudioChunk(audioChunk);
    meeting.transcript.push({
      text: transcription,
      timestamp: new Date()
    });

    // בדיקה רגולטורית רציפה
    await this.performRegulatoryCheck(meeting, transcription);

    return transcription;
  }

  async transcribeAudioChunk(audioChunk) {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioChunk,
        model: 'whisper-1',
        language: 'he'
      });
      return transcription.text;
    } catch (error) {
      console.error('שגיאת תמלול:', error);
      return '';
    }
  }

  async performRegulatoryCheck(meeting, transcriptChunk) {
    try {
      const analysis = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `בדוק את הקטע הנוכחי בשיחה מבחינה רגולטורית. 
            חפש:
            - חשש לניגוד עניינים
            - גילוי לא מלא של מידע
            - סעיפים הדורשים תשומת לב מיוחדת`
          },
          {
            role: "user",
            content: transcriptChunk
          }
        ]
      });

      const regulatoryNote = analysis.choices[0].message.content;
      meeting.regulatoryChecklist.push({
        text: regulatoryNote,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('שגיאת בדיקה רגולטורית:', error);
    }
  }

  async endMeeting(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) {
      throw new Error('פגישה לא נמצאה');
    }

    // יצירת סיכום מלא של הפגישה
    const summaryGeneration = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "צור סיכום מקצועי ומובנה של הפגישה, תוך התמקדות בנקודות העיקריות, החלטות והמלצות"
        },
        {
          role: "user",
          content: meeting.transcript.map(t => t.text).join('\n')
        }
      ]
    });

    meeting.summary = summaryGeneration.choices[0].message.content;
    meeting.endTime = new Date();
    meeting.status = 'completed';

    return {
      meetingId: meeting.id,
      summary: meeting.summary,
      duration: (meeting.endTime - meeting.startTime) / 1000, // משך הפגישה בשניות
      regulatoryNotes: meeting.regulatoryChecklist
    };
  }

  generateMeetingReport(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) {
      throw new Error('פגישה לא נמצאה');
    }

    return {
      id: meeting.id,
      user: meeting.user,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      status: meeting.status,
      transcript: meeting.transcript,
      summary: meeting.summary,
      regulatoryChecklist: meeting.regulatoryChecklist
    };
  }
}

module.exports = new MeetingManager();