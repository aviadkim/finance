import React from 'react';

export function TranscriptViewer({ transcript }) {
  if (!transcript) return null;

  return (
    <div className="transcript-viewer">
      <h3>תמלול שיחה</h3>
      <div className="transcript-content">
        {transcript.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <button 
        className="export-button"
        onClick={() => {
          const element = document.createElement("a");
          const file = new Blob([transcript], {type: 'text/plain'});
          element.href = URL.createObjectURL(file);
          element.download = `transcript-${new Date().toISOString()}.txt`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }}
      >
        ייצא תמלול
      </button>
    </div>
  );
}