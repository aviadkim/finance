import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PortfolioMonitoring() {
  const [portfolioData, setPortfolioData] = useState({
    clientId: '123',
    riskProfile: 'MODERATE',
    targetAllocation: {
      stocks: 60,
      bonds: 30,
      cash: 10
    },
    currentAllocation: {
      stocks: 65,
      bonds: 28,
      cash: 7
    },
    deviationThreshold: 5,
    performanceHistory: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 102 },
      { date: '2024-03', value: 105 },
      // Add more historical data
    ]
  });

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Check for allocation deviations
    const checkDeviations = () => {
      const newAlerts = [];
      Object.keys(portfolioData.targetAllocation).forEach(asset => {
        const deviation = Math.abs(
          portfolioData.currentAllocation[asset] - portfolioData.targetAllocation[asset]
        );
        if (deviation > portfolioData.deviationThreshold) {
          newAlerts.push({
            type: 'ALLOCATION_DEVIATION',
            asset,
            deviation,
            message: `${asset} allocation deviated by ${deviation.toFixed(1)}%`
          });
        }
      });
      setAlerts(newAlerts);
    };

    checkDeviations();
  }, [portfolioData]);

  return (
    <div className="portfolio-monitoring">
      <h2>ניטור תיק השקעות</h2>

      {/* Risk Profile Section */}
      <div className="risk-profile-section">
        <h3>פרופיל סיכון</h3>
        <div className="risk-indicator">
          <span className={`risk-level ${portfolioData.riskProfile.toLowerCase()}`}>
            {portfolioData.riskProfile}
          </span>
        </div>
      </div>

      {/* Allocation Chart */}
      <div className="allocation-section">
        <h3>הקצאת נכסים</h3>
        <div className="allocation-chart">
          {Object.entries(portfolioData.currentAllocation).map(([asset, value]) => (
            <div key={asset} className="allocation-bar">
              <div className="bar-label">{asset}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ width: `${value}%` }}
                ></div>
                <div 
                  className="target-line"
                  style={{ left: `${portfolioData.targetAllocation[asset]}%` }}
                ></div>
              </div>
              <div className="bar-value">{value}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-section">
        <h3>ביצועי תיק</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={portfolioData.performanceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              name="ערך תיק"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>התראות</h3>
          {alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <span className="alert-icon">⚠️</span>
              <span className="alert-message">{alert.message}</span>
              <button className="rebalance-btn">אזן מחדש</button>
            </div>
          ))}
        </div>
      )}

      {/* Debug Information */}
      <div className="debug-section">
        <h4>מידע לבדיקה</h4>
        <pre>{JSON.stringify(portfolioData, null, 2)}</pre>
        <pre>{JSON.stringify(alerts, null, 2)}</pre>
      </div>
    </div>
  );
}

export default PortfolioMonitoring;