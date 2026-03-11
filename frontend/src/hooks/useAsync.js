import { useState, useCallback } from 'react';

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setData(response.data);
      setStatus('success');
      return response.data;
    } catch (e) {
      setError(e);
      setStatus('error');
      throw e;
    }
  }, [asyncFunction]);

  if (immediate) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState(() => {
      execute();
    });
  }

  return { execute, status, data, error };
};

export const useMutation = () => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const mutate = useCallback(async (asyncFunction) => {
    setStatus('pending');
    setError(null);
    try {
      const response = await asyncFunction();
      setStatus('success');
      return response.data;
    } catch (e) {
      setError(e);
      setStatus('error');
      throw e;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { mutate, status, error, reset };
};
