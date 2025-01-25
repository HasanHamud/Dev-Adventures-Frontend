/* eslint-disable react/prop-types */
// In a Next.js project, this file could be located at: app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 5,
        retryDelay: 1000,
        cacheTime: 3 * 24 * 60 * 60 * 1000,
      },
    },
  });
}

let browserQueryClient = null;

function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}

/**
 * Providers component to wrap your app with required context providers.
 * @param {React.ReactNode} children - The children components to wrap.
 * @returns {React.ReactElement} The wrapped children with QueryClientProvider.
 */
export default function Providers({ children }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
