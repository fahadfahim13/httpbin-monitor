"use client";

import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { ResponseTable } from './ResponseTable';
import { useWebSocket } from '../hooks/useWebSocket';
import { useGetResponsesQuery } from '../store/services/httpbin';

export const Dashboard: React.FC = () => {
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const { data: responses = [], error, isLoading } = useGetResponsesQuery();
  
  // Initialize WebSocket
  useWebSocket({ onNewResponse: () => {
    setLastUpdateTime(new Date().toLocaleString());
  }});

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
          Error: {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Httpbin Response Monitor</h1>
      <StatusBar 
        totalResponses={responses.length} 
        lastUpdateTime={lastUpdateTime} 
      />
      <ResponseTable responses={responses} />
    </div>
  );
};