import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "@cloudscape-design/global-styles/index.css";
import "./index.css";

// Import configuration and setup
import { env } from "@/config/env";
import { queryClient } from "@/api/clients/query-client";
import { routeTree } from "./routeTree.gen";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  I18nProvider,
  importMessages,
} from "@cloudscape-design/components/i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Get the messages for the current locale through "lang" on <html>:
const locale = document.documentElement.lang;
const messages = await importMessages(locale);

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Validate environment before rendering
if (!env.VITE_API_BASE_URL) {
  throw new Error("API Base URL is not configured");
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nProvider locale={locale} messages={messages}>
          <RouterProvider router={router} />
          {env.MODE === "development" && (
            <>
              <TanStackRouterDevtools router={router} initialIsOpen={false} />
              <ReactQueryDevtools initialIsOpen={false} />
            </>
          )}
        </I18nProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
