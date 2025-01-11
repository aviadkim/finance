import React from 'react';
import { useClient } from '../../contexts/ClientContext';

const PortfolioSummary = () => {
  const { selectedClient } = useClient();
  const { portfolio } = selectedClient;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">תיק השקעות</h3>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">סך הכל</div>
          <div className="text-2xl font-bold">₪{portfolio.totalValue.toLocaleString()}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">מניות</div>
            <div className="font-medium">{portfolio.allocations.stocks}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">אג"ח</div>
            <div className="font-medium">{portfolio.allocations.bonds}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};