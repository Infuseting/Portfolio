import { useState, useEffect } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function getCachedItem<T>(key: string, ttlMs: number): T | null {
  if (typeof window === "undefined") return null;
  try {
    // Possibilité de forcer le rafraîchissement avec ?reset_cache=1
    if (new URLSearchParams(window.location.search).has("reset_cache")) {
      localStorage.removeItem(key);
      return null;
    }

    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed: CacheEntry<T> = JSON.parse(raw);
    const isExpired = Date.now() - parsed.timestamp > ttlMs;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (e) {
    console.warn(`[Cache] Error reading ${key}`, e);
    return null;
  }
}

export function setCachedItem<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {
    console.warn(`[Cache] Error writing ${key}`, e);
  }
}

export function clearCacheItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

interface UseCachedQueryOptions<T> {
  key: string;
  fetcher: (signal: AbortSignal) => Promise<T>;
  ttlMs?: number; // Durée de rétention (ex: 2 heures)
  minLoadingMs?: number; // Durée minimale d'affichage du skeleton (évite le flash)
  initialData?: T | null;
}

export function useCachedQuery<T>({
  key,
  fetcher,
  ttlMs = 1000 * 60 * 60 * 4, // 4 heures par défaut
  minLoadingMs = 800, // 800ms minimum pour voir le skeleton sans flash
  initialData = null,
}: UseCachedQueryOptions<T>) {
  // The first client render must match the server render. Read localStorage only
  // after hydration, otherwise a cached result replaces the SSR skeleton early.
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(initialData === null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    let isFetching = false;

    const fetchLatest = async (showLoading: boolean) => {
      if (isFetching) return;
      isFetching = true;

      if (showLoading) setIsLoading(true);

      const timerPromise = showLoading
        ? new Promise((resolve) => setTimeout(resolve, minLoadingMs))
        : Promise.resolve();

      try {
        const [result] = await Promise.all([fetcher(controller.signal), timerPromise]);
        if (isMounted) {
          setCachedItem(key, result);
          setData(result);
          setIsLoading(false);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError" && isMounted) {
          console.error(`[useCachedQuery] Error fetching ${key}:`, error);
          setIsLoading(false);
        }
      } finally {
        isFetching = false;
      }
    };

    const cached = getCachedItem<T>(key, ttlMs);
    const hasInitialData = initialData !== null;

    if (cached) {
      setData(cached);
      setIsLoading(false);
    } else {
      if (hasInitialData) {
        setData(initialData);
        setIsLoading(false);
      }
    }

    // Revalidate as soon as the island hydrates. Cached or prerendered data stays
    // visible while the request runs, so loading never blocks viewport animations.
    void fetchLatest(!cached && !hasInitialData);

    const refreshInterval = window.setInterval(() => {
      void fetchLatest(false);
    }, ttlMs);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
      controller.abort();
    };
  }, [key, ttlMs, minLoadingMs, initialData]);

  return { data, isLoading, setData };
}
