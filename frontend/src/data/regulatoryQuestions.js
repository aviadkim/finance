export const regulatoryQuestions = [
  // זיהוי לקוח
  {
    id: 1,
    category: 'זיהוי לקוח',
    question: 'האם זוהה הלקוח באמצעות תעודת זהות?',
    required: true,
    aiDetected: false
  },
  {
    id: 2,
    category: 'עדכון צרכים',
    question: 'האם חלו שינויים במצב המשפחתי?',
    required: true,
    aiDetected: false
  },
  {
    id: 3,
    category: 'עדכון צרכים',
    question: 'האם חלו שינויים במצב התעסוקתי?',
    required: true,
    aiDetected: false
  },
  {
    id: 4,
    category: 'צרכי נזילות',
    question: 'האם יש צורך בנזילות בשנה הקרובה?',
    required: true,
    aiDetected: false
  },
  {
    id: 5,
    category: 'הסברת סיכונים',
    question: 'האם הוסברו הסיכונים העיקריים בתיק?',
    required: true,
    aiDetected: false
  },
  {
    id: 6,
    category: 'התאמת מדיניות',
    question: 'האם נבדקה התאמת ההמלצות למדיניות ההשקעה?',
    required: true,
    aiDetected: false
  },
  {
    id: 7,
    category: 'גילוי נאות',
    question: 'האם ניתן גילוי נאות לגבי ניגודי עניינים וזיקות?',
    required: true,
    aiDetected: false
  },
  {
    id: 8,
    category: 'מעקב ותיעוד',
    question: 'האם נקבע מועד לפגישת מעקב?',
    required: true,
    aiDetected: false
  }
];

export const questionCategories = {
  CLIENT_IDENTIFICATION: 'זיהוי לקוח',
  NEEDS_UPDATE: 'עדכון צרכים',
  LIQUIDITY_NEEDS: 'צרכי נזילות',
  RISK_EXPLANATION: 'הסברת סיכונים',
  POLICY_ALIGNMENT: 'התאמת מדיניות',
  PROPER_DISCLOSURE: 'גילוי נאות',
  FOLLOW_UP: 'מעקב ותיעוד'
};
