'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function CacheStatus() {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);

  const getCacheInfo = () => {
    const queries = queryClient.getQueryCache().getAll();
    const mutations = queryClient.getMutationCache().getAll();
    
    return {
      totalQueries: queries.length,
      totalMutations: mutations.length,
      activeQueries: queries.filter(q => q.isActive()).length,
      staleQueries: queries.filter(q => q.isStale()).length,
    };
  };

  const cacheInfo = getCacheInfo();

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded text-xs z-50"
      >
        Cache
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Cache Status</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <div>Total Queries: {cacheInfo.totalQueries}</div>
        <div>Active Queries: {cacheInfo.activeQueries}</div>
        <div>Stale Queries: {cacheInfo.staleQueries}</div>
        <div>Total Mutations: {cacheInfo.totalMutations}</div>
      </div>
      <button
        onClick={() => queryClient.clear()}
        className="mt-2 w-full bg-red-500 text-white px-2 py-1 rounded text-xs"
      >
        Clear Cache
      </button>
    </div>
  );
} 