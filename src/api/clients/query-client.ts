import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 8, // 8 hours
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
