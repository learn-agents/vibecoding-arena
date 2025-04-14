// client/src/lib/staticDataClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Determines if we're running in static mode (no backend API)
const isStaticMode = import.meta.env.VITE_STATIC_MODE === 'true';

/**
 * Function to resolve paths for static data files that works in any deployment environment
 * By using paths relative to the current document location, we avoid absolute path issues
 */
const resolveStaticDataPath = (endpoint: string) => {
  // Convert API path to filename (e.g., '/api/prompts' → 'prompts.json')
  const filename = endpoint.replace(/^\/api\//, '').replace(/\/$/, '') + '.json';
  
  // Use a relative path reference that always works from current document location
  return `data/${filename}`;
};

// Function to handle static data fetch with robust path resolution
const staticDataFetcher: QueryFunction = async ({ queryKey }) => {
  const endpoint = queryKey[0] as string;
  const jsonPath = resolveStaticDataPath(endpoint);
  
  console.log(`[Static Mode] Loading data from: ${jsonPath}`);
  
  try {
    // Try to fetch the data with explicit error handling
    const response = await fetch(jsonPath);
    
    if (!response.ok) {
      console.error(`Failed to load data from ${jsonPath}. Status: ${response.status}`);
      
      // If the first attempt fails, try with a different path strategy
      // This helps when deployed in different environments with varying base paths
      const fallbackPath = `./${jsonPath}`;
      console.log(`Trying fallback path: ${fallbackPath}`);
      
      const fallbackResponse = await fetch(fallbackPath);
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to load data using multiple path strategies. Status: ${fallbackResponse.status}`);
      }
      
      return await fallbackResponse.json();
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error loading static data:`, error);
    
    // In case of failure, log detailed information to help with debugging
    console.log('Document location:', window.location.href);
    console.log('Attempted path:', jsonPath);
    
    throw error;
  }
};

// Default fetcher for API endpoints (when not in static mode)
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

// Create and export the query client with appropriate configuration
export const staticQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 3, // Increase retries to handle transient network issues
    },
    mutations: {
      retry: false,
    },
  },
});