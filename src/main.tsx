import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "@cloudscape-design/global-styles/index.css";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  I18nProvider,
  importMessages,
} from "@cloudscape-design/components/i18n";

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

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <I18nProvider locale={locale} messages={messages}>
        <RouterProvider router={router} />
        <TanStackRouterDevtools router={router} initialIsOpen={false} />
      </I18nProvider>
    </StrictMode>
  );
}
