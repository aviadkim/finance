import React, { useState, useEffect, useRef } from 'react';
import './MeetingInterface.css';
import AIService from '../../services/AIService';
import { regulatoryQuestions } from '../../data/regulatoryQuestions';

function MeetingInterface() {
  // [Previous state and setup code remains the same...]

  return (
    <div className="meeting-interface">
      {/* Recording Section */}
      <div className="recording-section">
        <button 
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'הפסק הקלטה' : 'התחל הקלטה'}
        </button>
        {isRecording && (
          <div className="transcript-display">
            {transcript || 'מקשיב...'}
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="questions-section">
        {formData.questions.map((question, index) => (
          <div key={index} className="question-card">
            <div className="question-header">
              <span className="category">{question.category}</span>
              {question.aiDetected && (
                <span className="ai-badge">זוהה ע"י AI</span>
              )}
            </div>
            <p className="question-text">{question.question}</p>
            <div className="answer-buttons">
              <button 
                className={question.answer === 'yes' ? 'selected' : ''}
                onClick={() => handleAnswer(index, 'yes')}
              >
                כן
              </button>
              <button 
                className={question.answer === 'no' ? 'selected' : ''}
                onClick={() => handleAnswer(index, 'no')}
              >
                לא
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h3>סיכום שיחה</h3>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({
            ...formData,
            summary: e.target.value
          })}
          placeholder="הכנס סיכום שיחה..."
        />
      </div>

      {/* AI Suggestions */}
      {aiSuggestions && (
        <div className="ai-suggestions">
          <h3>המלצות AI</h3>
          <div className="suggestions-content">
            {aiSuggestions.nextQuestions?.map((q, i) => (
              <div key={i} className="suggestion-item">
                <span className="suggestion-icon">❓</span>
                <span className="suggestion-text">{q}</span>
              </div>
            ))}
            {aiSuggestions.missedPoints?.map((p, i) => (
              <div key={i} className="suggestion-item warning">
                <span className="suggestion-icon">⚠️</span>
                <span className="suggestion-text">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Information - will be removed in production */}
      <div className="debug-panel">
        <h4>מידע לבדיקה</h4>
        <pre>{JSON.stringify({
          transcript,
          aiSuggestions,
          formData
        }, null, 2)}</pre>
      </div>
    </div>
  );
}

export default MeetingInterface;