import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

export function useBlogs(initialFilters = {}) {
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getBlogs(filters);
      setBlogs(data.blogs || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    blogs,
    total,
    loading,
    error,
    filters,
    setFilters,
    refresh,
  };
}
