"use client";

import React from "react";
import { StatusBar } from "./StatusBar";
import { ResponseTable } from "./ResponseTable";
import { DateRangeFilter } from "./DateRangeFilter";
import useDashboardFunctionalities from "../hooks/useDashboardFunctionalities";

export const Dashboard: React.FC = () => {
  const {
    isLoading,
    error,
    setEndDate,
    setStartDate,
    startDate,
    endDate,
    handleFilter,
    clearFilter,
    isFiltering,
    filteredResponses,
    responses,
    lastUpdateTime,
  } = useDashboardFunctionalities();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-500">
          Error: {error instanceof Error ? error.message : "An error occurred"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Httpbin Response Monitor</h1>
      <DateRangeFilter
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        startDate={startDate}
        endDate={endDate}
        handleFilter={handleFilter}
        clearFilter={clearFilter}
      />
      <StatusBar
        totalResponses={
          isFiltering ? filteredResponses.length : responses.length
        }
        lastUpdateTime={isFiltering ? "N/A" : lastUpdateTime}
      />
      <ResponseTable responses={isFiltering ? filteredResponses : responses} />
    </div>
  );
};
