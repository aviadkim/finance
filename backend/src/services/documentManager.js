const fs = require('fs').promises;
const path = require('path');
const { PDFDocument, StandardFonts } = require('pdf-lib');

class DocumentManager {
  constructor() {
    this.documentsPath = path.resolve(__dirname, '../../../documents');
  }

  async createMeetingPDF(meetingData) {
    try {
      // יצירת מסמך PDF חדש
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HebrewFont);

      // כתיבת פרטי הפגישה
      page.drawText(`פגישה עם: ${meetingData.clientName}`, {
        x: width - 100,
        y: height - 50,
        size: 12,
        font: font
      });

      page.drawText(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, {
        x: width - 100,
        y: height - 70,
        size: 10,
        font: font
      });

      // הוספת תמלול ונקודות עיקריות
      page.drawText('תמלול השיחה:', {
        x: width - 100,
        y: height - 100,
        size: 12,
        font: font
      });

      page.drawText(meetingData.transcript, {
        x: width - 100,
        y: height - 130,
        size: 10,
        font: font,
        maxWidth: width - 50
      });

      // שמירת המסמך
      const pdfBytes = await pdfDoc.save();
      const fileName = `meeting_${meetingData.clientName}_${Date.now()}.pdf`;
      const filePath = path.join(this.documentsPath, fileName);

      await fs.mkdir(this.documentsPath, { recursive: true });
      await fs.writeFile(filePath, pdfBytes);

      return {
        fileName,
        filePath,
        size: pdfBytes.length
      };
    } catch (error) {
      console.error('שגיאה ביצירת מסמך PDF:', error);
      throw error;
    }
  }

  async listDocuments() {
    try {
      const files = await fs.readdir(this.documentsPath);
      return files.map(file => ({
        name: file,
        path: path.join(this.documentsPath, file)
      }));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // תיקייה לא קיימת
      }
      throw error;
    }
  }

  async sendDocumentByEmail(documentPath, recipientEmail) {
    // יישום שליחת מייל עם המסמך
    // נדרש מודול שליחת מיילים כמו nodemailer
    // מימוש זה יהיה תלוי בהגדרות SMTP
    console.log(`שולח מסמך ל-${recipientEmail}`);
  }
}

module.exports = new DocumentManager();