"use client";

import React, { useState } from 'react';
import { useGetResponsesByDateRangeQuery } from '../store/services/httpbin';

export const DateRangeFilter: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const { data: filteredResponses, isLoading } = useGetResponsesByDateRangeQuery(
    { startDate, endDate },
    { skip: !isFiltering }
  );

  const handleFilter = () => {
    setIsFiltering(true);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setIsFiltering(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="flex items-end space-x-2">
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!startDate || !endDate}
          >
            Apply Filter
          </button>
          <button
            onClick={clearFilter}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};