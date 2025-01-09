import React from 'react';

interface StatusBarProps {
  totalResponses: number;
  lastUpdateTime: string | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({ totalResponses, lastUpdateTime }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Responses</h3>
          <p className="text-2xl font-semibold text-gray-900">{totalResponses}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Last Update</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {lastUpdateTime ? new Date(lastUpdateTime).toLocaleTimeString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};
