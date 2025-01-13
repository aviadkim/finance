class SummaryService {
  generateSummary(transcript, meetingDuration) {
    const mainPoints = this.extractMainPoints(transcript);
    const recommendations = this.extractRecommendations(transcript);
    const followUpTasks = this.extractTasks(transcript);
    const regulatoryStatus = this.checkRegulatoryItems(transcript);
    
    return {
      title: 'סיכום פגישת ייעוץ',
      date: new Date().toLocaleDateString('he-IL'),
      duration: this.formatDuration(meetingDuration),
      mainPoints,
      recommendations,
      followUpTasks,
      regulatoryStatus
    };
  }

  extractMainPoints(transcript) {
    const points = [];
    const keyPhrases = {
      investmentGoal: ['מטרת השקעה', 'טווח', 'תקופה'],
      riskLevel: ['סיכון', 'שמרן', 'אגרסיבי'],
      liquidity: ['נזילות', 'צורך בכסף', 'משיכה']
    };

    transcript.forEach(entry => {
      if (entry.text) {
        // Extract investment goals
        if (keyPhrases.investmentGoal.some(phrase => entry.text.includes(phrase))) {
          points.push({
            category: 'מטרת השקעה',
            text: entry.text
          });
        }

        // Extract risk level
        if (keyPhrases.riskLevel.some(phrase => entry.text.includes(phrase))) {
          points.push({
            category: 'רמת סיכון',
            text: entry.text
          });
        }

        // Extract liquidity needs
        if (keyPhrases.liquidity.some(phrase => entry.text.includes(phrase))) {
          points.push({
            category: 'דרישות נזילות',
            text: entry.text
          });
        }
      }
    });

    return points;
  }

  extractRecommendations(transcript) {
    const recommendations = [];
    const recommendationPhrases = ['ממליץ', 'מציע', 'כדאי', 'תיק מאוזן'];

    transcript.forEach(entry => {
      if (entry.speaker === 'advisor' && 
          recommendationPhrases.some(phrase => entry.text.includes(phrase))) {
        recommendations.push(entry.text);
      }
    });

    return recommendations;
  }

  extractTasks(transcript) {
    const tasks = [];
    const taskPhrases = ['נקבע', 'אשלח', 'נפגש', 'להעביר', 'לבדוק'];

    transcript.forEach(entry => {
      if (entry.speaker === 'advisor' && 
          taskPhrases.some(phrase => entry.text.includes(phrase))) {
        tasks.push(entry.text);
      }
    });

    return tasks;
  }

  checkRegulatoryItems(transcript) {
    const regulatoryItems = {
      'בירור מטרות השקעה': false,
      'בירור רמת סיכון': false,
      'בירור צרכי נזילות': false
    };

    transcript.forEach(entry => {
      if (entry.speaker === 'advisor') {
        if (entry.text.includes('מטרות') || entry.text.includes('טווח')) {
          regulatoryItems['בירור מטרות השקעה'] = true;
        }
        if (entry.text.includes('סיכון')) {
          regulatoryItems['בירור רמת סיכון'] = true;
        }
        if (entry.text.includes('נזילות') || entry.text.includes('צורך בכסף')) {
          regulatoryItems['בירור צרכי נזילות'] = true;
        }
      }
    });

    return regulatoryItems;
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} דקות`;
  }

  formatSummaryText(summary) {
    return `סיכום פגישת ייעוץ
תאריך: ${summary.date}
משך: ${summary.duration}

נקודות עיקריות:
${summary.mainPoints.map(point => `• ${point.category}: ${point.text}`).join('\n')}

המלצות:
${summary.recommendations.map(rec => `• ${rec}`).join('\n')}

משימות להמשך:
${summary.followUpTasks.map((task, index) => `${index + 1}. ${task}`).join('\n')}

סטטוס רגולטורי:
${Object.entries(summary.regulatoryStatus)
  .map(([item, completed]) => `${completed ? '✓' : '✗'} ${item}`)
  .join('\n')}`;
  }
}

export default new SummaryService();