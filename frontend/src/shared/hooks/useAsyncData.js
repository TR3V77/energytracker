import { useState, useEffect, useCallback } from "react";

export const useAsyncData = (fetchFn, options = {}) => {
  const { initialData = null, loadOnMount = true } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "Failed to fetch");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (loadOnMount) execute();
  }, [execute, loadOnMount]);

  return { data, loading, error, refetch: execute };
};