// client/src/lib/staticDataClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Determines if we're running in static mode (no backend API)
const isStaticMode = import.meta.env.VITE_STATIC_MODE === 'true';

// Get the base URL for static assets (to handle different deployment environments)
const getBaseUrl = () => {
  // In production, use the relative path to the current location
  // This ensures it works regardless of the deployment base path
  return '';
};

// Function to handle static data fetch
const staticDataFetcher: QueryFunction = async ({ queryKey }) => {
  const endpoint = queryKey[0] as string;
  
  // Convert API path to static data path
  const staticPath = endpoint
    .replace(/^\/api\//, '/data/')  // replace /api/ prefix with /data/
    .replace(/\/$/, '');            // remove trailing slash if any
  
  const baseUrl = getBaseUrl();
  const jsonPath = `${baseUrl}${staticPath}.json`;
  
  console.log(`Loading static data from: ${jsonPath}`);
  
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) {
      console.error(`Failed to load static data from ${jsonPath}. Status: ${response.status}`);
      throw new Error(`Failed to load static data from ${jsonPath}. Status: ${response.status}`);
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
      retry: 2, // Retry failed requests a couple of times
    },
    mutations: {
      retry: false,
    },
  },
});