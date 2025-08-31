import { useState, useCallback } from "react";

export interface UseFetchOptions extends Omit<RequestInit, "method" | "body"> {
  baseUrl?: string;
}

export interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  get: (url: string, options?: UseFetchOptions) => Promise<T>;
  post: (url: string, body?: any, options?: UseFetchOptions) => Promise<T>;
  patch: (url: string, body?: any, options?: UseFetchOptions) => Promise<T>;
  delete: (url: string, options?: UseFetchOptions) => Promise<T>;
  reset: () => void;
}

const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export function useFetch<T = any>(
  initialOptions?: UseFetchOptions,
): UseFetchReturn<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const baseUrl = initialOptions?.baseUrl || DEFAULT_BASE_URL;

  const request = useCallback(
    async (
      method: string,
      url: string,
      body?: any,
      options?: UseFetchOptions,
    ): Promise<T> => {
      const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const config: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...initialOptions?.headers,
            ...options?.headers,
          },
          ...initialOptions,
          ...options,
        };

        if (
          body &&
          (method === "POST" || method === "PATCH" || method === "PUT")
        ) {
          config.body = typeof body === "string" ? body : JSON.stringify(body);
        }

        const response = await fetch(fullUrl, config);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "An error occurred" }));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`,
          );
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setState({ data: null, loading: false, error: errorMessage });
        throw error;
      }
    },
    [baseUrl, initialOptions],
  );

  const get = useCallback(
    (url: string, options?: UseFetchOptions) =>
      request("GET", url, undefined, options),
    [request],
  );

  const post = useCallback(
    (url: string, body?: any, options?: UseFetchOptions) =>
      request("POST", url, body, options),
    [request],
  );

  const patch = useCallback(
    (url: string, body?: any, options?: UseFetchOptions) =>
      request("PATCH", url, body, options),
    [request],
  );

  const deleteRequest = useCallback(
    (url: string, options?: UseFetchOptions) =>
      request("DELETE", url, undefined, options),
    [request],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    get,
    post,
    patch,
    delete: deleteRequest,
    reset,
  };
}
