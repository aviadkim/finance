import React from 'react';

const ClientTasks = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">משימות</h3>
      <div className="space-y-2">
        {[
          { task: 'עדכון צרכים רבעוני', due: '2024-02-01', urgent: true },
          { task: 'השלמת מסמכים', due: '2024-02-15', urgent: false }
        ].map((task, index) => (
          <div key={index} className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
            <div className="mr-2">
              <div className={`font-medium ${task.urgent ? 'text-red-600' : ''}`}>{task.task}</div>
              <div className="text-sm text-gray-500">תאריך יעד: {task.due}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};