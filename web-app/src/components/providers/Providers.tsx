"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const TIME = 1000 * 60 * 60;
export default function Providers({ children }: { children: React.ReactNode }) {
  // We use useState to ensure the QueryClient is only created once per user session,
  // preventing data from leaking between users during Server-Side Rendering.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // By default, let's keep things in cache for 1 hour before garbage collection
            gcTime: TIME,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
