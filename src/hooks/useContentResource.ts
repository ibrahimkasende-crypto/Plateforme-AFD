import { useCallback, useEffect, useState } from 'react';
import type { ContentResult } from '../services/contentService';

interface ResourceState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  isFallback: boolean;
}

export function useContentResource<T>(loader: () => Promise<ContentResult<T>>, initialData: T) {
  const [state, setState] = useState<ResourceState<T>>({
    data: initialData,
    loading: true,
    error: null,
    isFallback: false,
  });

  const reload = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    const result = await loader();
    setState({
      data: result.data,
      loading: false,
      error: result.error?.message ?? null,
      isFallback: result.isFallback,
    });
  }, [loader]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ...state, reload };
}
