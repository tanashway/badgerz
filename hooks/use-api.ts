import { useState, useEffect } from 'react';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  enabled?: boolean;
}

export function useApi<T = any>(
  endpoint: string,
  options: ApiOptions = {}
) {
  const {
    method = 'GET',
    body,
    headers = {},
    params = {},
    onSuccess,
    onError,
    enabled = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Build URL with query parameters
  const buildUrl = () => {
    const url = new URL(endpoint, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    return url.toString();
  };

  // Function to fetch data
  const fetchData = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(buildUrl(), requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      onSuccess?.(responseData);
      return responseData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount or when dependencies change
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [endpoint, enabled, JSON.stringify(params)]);

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
    setData
  };
}

// Mutation hook for POST, PUT, PATCH, DELETE operations
export function useApiMutation<T = any, R = any>(
  endpoint: string,
  options: Omit<ApiOptions, 'enabled'> = {}
) {
  const {
    method = 'POST',
    headers = {},
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mutate = async (body: T, params: Record<string, string> = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build URL with query parameters
      const url = new URL(endpoint, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });

      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      onSuccess?.(responseData);
      return responseData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    data,
    error,
    isLoading,
    reset: () => {
      setData(null);
      setError(null);
    }
  };
} 