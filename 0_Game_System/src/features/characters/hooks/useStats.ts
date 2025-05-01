import { useState, useCallback } from 'react';
import { InputStats } from '../types';
import { generateRandomStats } from '../utils/validation';

export function useStats(initialStats?: InputStats[]) {
  const [stats, setStats] = useState<InputStats[]>(initialStats || []);

  const updateStats = useCallback((newStats: InputStats[]) => {
    setStats(newStats);
  }, []);

  const randomizeStats = useCallback(() => {
    setStats(generateRandomStats());
  }, []);

  const updateStatValue = useCallback((statId: string, field: keyof InputStats, value: number) => {
    setStats(prevStats => 
      prevStats.map(stat => 
        stat.id === statId ? { ...stat, [field]: value } : stat
      )
    );
  }, []);

  return {
    stats,
    updateStats,
    randomizeStats,
    updateStatValue
  };
}