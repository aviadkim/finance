
const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');

class ReportGenerator {
  async generateMeetingReport(data) {
    const {
      clientName,
      transcript,
      analysis,
      startTime,
      duration,
      recommendations
    } = data;

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      lang: 'he',
      features: {
        direction: 'rtl'
      }
    });

    const reportPath = path.join(__dirname, `../../../reports/${clientName}_${Date.now()}.pdf`);
    const stream = fs.createWriteStream(reportPath);

    return new Promise((resolve, reject) => {
      // Pipe the PDF to file
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('סיכום פגישת ייעוץ פיננסי', { align: 'right' });
      doc.moveDown();

      // Client Details
      doc.fontSize(14).text(`שם לקוח: ${clientName}`, { align: 'right' });
      doc.text(`תאריך: ${new Date(startTime).toLocaleDateString('he-IL')}`, { align: 'right' });
      doc.text(`משך: ${Math.round(duration)} דקות`, { align: 'right' });
      doc.moveDown();

      // Transcript Summary
      doc.fontSize(16).text('תמלול השיחה:', { align: 'right' });
      doc.fontSize(12).text(transcript, { align: 'right' });
      doc.moveDown();

      // Regulatory Analysis
      doc.fontSize(16).text('ניתוח רגולטורי:', { align: 'right' });
      if (analysis.issues.length > 0) {
        doc.fontSize(12).text('נושאים לטיפול:', { align: 'right' });
        analysis.issues.forEach(issue => {
          doc.text(`• ${issue.description}`, { align: 'right' });
        });
      } else {
        doc.fontSize(12).text('לא נמצאו בעיות רגולטוריות.', { align: 'right' });
      }
      doc.moveDown();

      // Recommendations
      if (recommendations && recommendations.length > 0) {
        doc.fontSize(16).text('המלצות:', { align: 'right' });
        recommendations.forEach(rec => {
          doc.fontSize(12).text(`• ${rec}`, { align: 'right' });
        });
      }

      // Footer
      doc.fontSize(10)
         .text('מסמך זה נוצר אוטומטית על ידי מערכת ניהול פגישות יועצים.', {
           align: 'center',
           bottom: 50
         });

      // Finalize PDF
      doc.end();

      stream.on('finish', () => resolve(reportPath));
      stream.on('error', reject);
    });
  }
}

module.exports = new ReportGenerator();
