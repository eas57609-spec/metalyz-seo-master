'use client';

import { useState, useEffect } from 'react';
import { getSystemStats, subscribeToStats, DatabaseStats } from '@/lib/supabase';

export function useStats() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await getSystemStats();
        
        // If no data exists, initialize with zero values for fresh start
        if (!data) {
          const freshStats: DatabaseStats = {
            id: 'initial',
            monthly_revenue: 0,
            active_subscriptions: 0,
            global_users: 1, // At least the owner
            total_projects: 0,
            total_generated_tags: 0,
            updated_at: new Date().toISOString()
          };
          setStats(freshStats);
        } else {
          setStats(data);
        }
        setError(null);

        // Set up real-time subscription
        unsubscribe = subscribeToStats((newStats) => {
          setStats(newStats);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
        // Fallback to zero values for fresh start
        setStats({
          id: 'fallback',
          monthly_revenue: 0,
          active_subscriptions: 0,
          global_users: 1,
          total_projects: 0,
          total_generated_tags: 0,
          updated_at: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { stats, loading, error };
}