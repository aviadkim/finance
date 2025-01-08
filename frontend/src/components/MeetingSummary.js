import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MeetingSummary = ({ transcript, clientName, startTime }) => {
  const [summary, setSummary] = useState('');
  const [regulatoryIssues, setRegulatoryIssues] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (transcript) {
      generateSummary();
    }
  }, [transcript]);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/generate-summary', {
        transcript,
        clientName,
        startTime: startTime.toISOString()
      });
      
      setSummary(response.data.summary);
      setRegulatoryIssues(response.data.regulatoryIssues || []);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
    setIsGenerating(false);
  };

  const downloadSummary = async () => {
    try {
      const response = await axios.post('/api/download-summary', {
        summary,
        regulatoryIssues,
        clientName,
        startTime: startTime.toISOString()
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `summary_${clientName}_${new Date().toISOString()}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading summary:', error);
    }
  };

  return (
    <div className="meeting-summary">
      <h2>סיכום פגישה</h2>
      {isGenerating ? (
        <div>מייצר סיכום...</div>
      ) : (
        <>
          <div className="summary-content">
            <h3>נקודות עיקריות</h3>
            <pre>{summary}</pre>
          </div>

          {regulatoryIssues.length > 0 && (
            <div className="regulatory-issues">
              <h3>נושאים רגולטוריים לטיפול</h3>
              <ul>
                {regulatoryIssues.map((issue, index) => (
                  <li key={index} className={`severity-${issue.severity}`}>
                    {issue.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={downloadSummary}>
            הורד סיכום PDF
          </button>
        </>
      )}
    </div>
  );
};

export default MeetingSummary;