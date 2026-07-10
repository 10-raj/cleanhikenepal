import { useState, useEffect, useMemo } from 'react';
import { getHikes, getHikeById, getFeaturedHikes } from '../services/api';
import { Hike } from '../types';

type HikeFilters = {
  difficulty?: string;
  featured?: boolean;
  search?: string;
};

export function useHikes(filters?: HikeFilters) {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ✅ stabilize filters to prevent infinite re-renders
  const stableFilters = useMemo(() => {
    return {
      difficulty: filters?.difficulty,
      featured: filters?.featured,
      search: filters?.search,
    };
  }, [filters?.difficulty, filters?.featured, filters?.search]);

  useEffect(() => {
    async function fetchHikes() {
      try {
        setLoading(true);

        const data = await getHikes(stableFilters);
        setHikes((data as Hike[]) || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch hikes')
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHikes();
  }, [stableFilters]);

  return { hikes, loading, error };
}

export function useHike(id: string) {
  const [hike, setHike] = useState<Hike | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHike() {
      if (!id) return;

      try {
        setLoading(true);

        const data = await getHikeById(id);
        setHike((data as Hike) || null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch hike')
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHike();
  }, [id]);

  return { hike, loading, error };
}

export function useFeaturedHikes() {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHikes() {
      try {
        setLoading(true);

        const data = await getFeaturedHikes();
        setHikes((data as Hike[]) || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch featured hikes')
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHikes();
  }, []);

  return { hikes, loading, error };
}