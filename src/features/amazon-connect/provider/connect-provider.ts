import { AmazonConnectApp } from "@amazon-connect/app";
import type { AmazonConnectProvider } from "@amazon-connect/core";

/**
 * Whether the app is running inside the Amazon Connect Agent Workspace iframe.
 * When false, SDK initialization is skipped to avoid timeout errors in local dev.
 */
const isEmbeddedInWorkspace = window.self !== window.top;

let provider: AmazonConnectProvider | null = null;

/**
 * Initializes the Amazon Connect SDK provider.
 *
 * In the Agent Workspace iframe, calls `AmazonConnectApp.init()` which establishes
 * the communication channel with the workspace. Returns the provider used to
 * instantiate all SDK clients (AgentClient, ContactClient, etc.).
 *
 * In local development (not in an iframe), skips initialization and returns null.
 * Clients should check for a null provider before making SDK calls.
 */
export function initConnectProvider(): AmazonConnectProvider | null {
  if (!isEmbeddedInWorkspace) {
    console.warn(
      "[AmazonConnect] Not running inside Agent Workspace iframe. " +
        "SDK initialization skipped. Clients will not be available.",
    );
    return null;
  }

  if (provider) {
    console.warn("[AmazonConnect] Provider already initialized.");
    return provider;
  }

  const result = AmazonConnectApp.init({
    onCreate: async (event) => {
      console.log("[AmazonConnect] App created:", event.context.instanceId);
    },
    onDestroy: async () => {
      console.log("[AmazonConnect] App destroyed. Cleaning up resources.");
    },
  });

  provider = result.provider;
  return provider;
}

/**
 * Returns the initialized provider, or null if not available
 * (e.g., running outside the Agent Workspace).
 */
export function getConnectProvider(): AmazonConnectProvider | null {
  return provider;
}
