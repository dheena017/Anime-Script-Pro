/**
 * useOptimizedData - Custom hook for cached, performant data fetching
 * Features:
 * - Automatic caching with TTL
 * - Deferred rendering (shows skeleton first)
 * - Reduced loading timeouts
 * - Prevents redundant requests
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { dataCache } from '@/services/cache/dataCache';

interface UseOptimizedDataOptions {
  cacheKey?: string;
  cacheTTL?: number;
  timeout?: number; // Reduced timeout before showing content anyway
  skipFetch?: boolean;
}

interface UseOptimizedDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
  isFromCache: boolean;
}

export function useOptimizedData<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  options: UseOptimizedDataOptions = {}
): UseOptimizedDataReturn<T> {
  const {
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    timeout = 2500, // Show content after 2.5s instead of 10s
    skipFetch = false
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (skipFetch) {
      setLoading(false);
      return;
    }

    // Check cache first
    if (cacheKey) {
      const cached = dataCache.get<T>(cacheKey);
      if (cached) {
        setData(cached);
        setIsFromCache(true);
        setLoading(false);
        return;
      }
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);
    setIsFromCache(false);

    try {
      // Set failsafe timeout - show content after this duration regardless
      timeoutRef.current = setTimeout(() => {
        if (loading) {
          console.warn('Data fetch timeout - forcing render with partial data');
          setLoading(false);
        }
      }, timeout);

      const result = await fetchFn();

      if (abortControllerRef.current?.signal.aborted) return;

      setData(result);

      // Cache the result if cacheKey is provided
      if (cacheKey) {
        dataCache.set(cacheKey, result, cacheTTL);
      }

      setLoading(false);
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      console.error('Data fetch error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setLoading(false);
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [fetchFn, cacheKey, cacheTTL, timeout, skipFetch, loading]);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, deps);

  const retry = useCallback(() => {
    if (cacheKey) {
      dataCache.clear(cacheKey);
    }
    fetchData();
  }, [fetchData, cacheKey]);

  return { data, loading, error, retry, isFromCache };
}
