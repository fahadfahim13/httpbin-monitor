"use client";

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { HttpbinResponse } from '@/types';
import { StatusBar } from './StatusBar';
import { ResponseTable } from './ResponseTable';

export const Dashboard: React.FC = () => {
  const [responses, setResponses] = useState<HttpbinResponse[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useWebSocket({
    onNewResponse: (newResponse) => {
      setResponses((prev) => [newResponse, ...prev]);
      setLastUpdateTime(new Date().toISOString());
    },
  });

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/responses`);
        if (!res.ok) throw new Error('Failed to fetch responses');
        const data = await res.json();
        setResponses(data);
        setLastUpdateTime(new Date().toISOString());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Httpbin Response Monitor</h1>
      <StatusBar totalResponses={responses.length} lastUpdateTime={lastUpdateTime} />
      <ResponseTable responses={responses} />
    </div>
  );
};