// client/src/lib/staticDataClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Determines if we're running in static mode (no backend API)
const isStaticMode = import.meta.env.VITE_STATIC_MODE === 'true';

// Function to handle static data fetch
const staticDataFetcher: QueryFunction = async ({ queryKey }) => {
  const endpoint = queryKey[0] as string;
  
  // Convert API path to static data path
  const staticPath = endpoint
    .replace(/^\/api\//, '/data/')  // replace /api/ prefix with /data/
    .replace(/\/$/, '');            // remove trailing slash if any
  
  const jsonPath = `${staticPath}.json`;
  
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Failed to load static data from ${jsonPath}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading static data from ${jsonPath}:`, error);
    throw error;
  }
};

// Default fetcher for API endpoints
const apiFetcher: QueryFunction = async ({ queryKey }) => {
  const response = await fetch(queryKey[0] as string, {
    credentials: "include",
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text || response.statusText}`);
  }
  
  return await response.json();
};

// Select the appropriate fetcher based on mode
const queryFn = isStaticMode ? staticDataFetcher : apiFetcher;

// Create and export the query client
export const staticQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});