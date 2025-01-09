import React, { useState, useEffect } from 'react';

function DocumentManager() {
  const [templates, setTemplates] = useState([
    {
      id: 'ANNUAL_REVIEW',
      name: 'סיכום פגישה שנתית',
      sections: [
        {
          title: 'פרטי לקוח',
          fields: ['name', 'id', 'date']
        },
        {
          title: 'סיכום צרכים',
          fields: ['riskProfile', 'investmentGoals', 'constraints']
        },
        {
          title: 'המלצות',
          fields: ['recommendations', 'justification']
        }
      ]
    },
    {
      id: 'RISK_ASSESSMENT',
      name: 'הערכת סיכונים',
      sections: [
        {
          title: 'פרופיל סיכון',
          fields: ['riskTolerance', 'timeHorizon', 'experience']
        },
        {
          title: 'ניתוח תיק',
          fields: ['currentAllocation', 'recommendedChanges']
        }
      ]
    }
  ]);

  const [auditTrail, setAuditTrail] = useState([
    {
      timestamp: new Date().toISOString(),
      action: 'DOCUMENT_CREATED',
      userId: 'advisor123',
      details: {
        documentType: 'ANNUAL_REVIEW',
        clientId: 'client456'
      }
    }
  ]);

  const [activeDocument, setActiveDocument] = useState(null);
  const [debugMode, setDebugMode] = useState(true);

  const createDocument = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newDocument = {
      id: Date.now().toString(),
      templateId,
      created: new Date().toISOString(),
      data: {},
      status: 'DRAFT'
    };

    // Add audit trail entry
    addAuditEntry('DOCUMENT_CREATED', { documentId: newDocument.id, templateId });
    setActiveDocument(newDocument);
  };

  const addAuditEntry = (action, details) => {
    const newEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId: 'advisor123', // This would come from auth context
      details
    };
    setAuditTrail(prev => [newEntry, ...prev]);
  };

  return (
    <div className="document-manager">
      <h2>מערכת מסמכים</h2>

      {/* Templates Section */}
      <div className="templates-section">
        <h3>תבניות מסמכים</h3>
        <div className="templates-list">
          {templates.map(template => (
            <div key={template.id} className="template-card">
              <h4>{template.name}</h4>
              <button onClick={() => createDocument(template.id)}>
                צור מסמך חדש
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Document Section */}
      {activeDocument && (
        <div className="active-document">
          <h3>מסמך פעיל</h3>
          <div className="document-form">
            {templates
              .find(t => t.id === activeDocument.templateId)
              ?.sections.map((section, sIndex) => (
                <div key={sIndex} className="document-section">
                  <h4>{section.title}</h4>
                  {section.fields.map((field, fIndex) => (
                    <div key={fIndex} className="form-field">
                      <label>{field}</label>
                      <input
                        type="text"
                        value={activeDocument.data[field] || ''}
                        onChange={(e) => {
                          const newData = {
                            ...activeDocument.data,
                            [field]: e.target.value
                          };
                          setActiveDocument({
                            ...activeDocument,
                            data: newData
                          });
                          addAuditEntry('FIELD_UPDATED', {
                            documentId: activeDocument.id,
                            field,
                            value: e.target.value
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Debug Section */}
      {debugMode && (
        <div className="debug-section">
          <h4>מידע לבדיקה</h4>
          <div className="debug-panel">
            <h5>תיעוד פעולות</h5>
            <pre>{JSON.stringify(auditTrail, null, 2)}</pre>
            
            <h5>מסמך נוכחי</h5>
            <pre>{JSON.stringify(activeDocument, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentManager;