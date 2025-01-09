"use client";

import React, { Dispatch, SetStateAction } from 'react';

export const DateRangeFilter = (props: {
    startDate: string;
    setStartDate: Dispatch<SetStateAction<string>>;
    endDate: string;
    setEndDate: Dispatch<SetStateAction<string>>;
    handleFilter: () => void;
    clearFilter: () => void;
}) => {

    const { startDate, setStartDate, endDate, setEndDate, handleFilter, clearFilter } = props;

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            id="end-date"
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