const PDFDocument = require('pdfkit');

function generateReport(transcript, compliance, metadata) {
  const doc = new PDFDocument();
  const filename = `report-${new Date().toISOString()}.pdf`;

  // Add header
  doc.fontSize(16).text('דוח שיחה וניתוח רגולטורי', { align: 'right' });
  doc.moveDown();

  // Add metadata
  doc.fontSize(12)
    .text(`תאריך: ${metadata.date}`, { align: 'right' })
    .text(`יועץ: ${metadata.advisor}`, { align: 'right' })
    .text(`לקוח: ${metadata.client}`, { align: 'right' });
  doc.moveDown();

  // Add compliance summary
  doc.fontSize(14).text('סיכום עמידה בדרישות רגולטוריות', { align: 'right' });
  doc.fontSize(12).text(`אחוז השלמה: ${compliance.completionRate}%`, { align: 'right' });
  doc.moveDown();

  // Add missing questions
  if (compliance.missingQuestions.length > 0) {
    doc.text('שאלות חסרות:', { align: 'right' });
    compliance.missingQuestions.forEach(q => {
      doc.text(`- ${q.text}`, { align: 'right' });
    });
  }
  doc.moveDown();

  // Add transcript
  doc.fontSize(14).text('תמלול השיחה:', { align: 'right' });
  doc.fontSize(12).text(transcript, { align: 'right' });

  return doc;
}

module.exports = { generateReport };