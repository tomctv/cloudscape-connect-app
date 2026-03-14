import { EmailClient } from "@amazon-connect/email";
import { getConnectProvider } from "../provider";

let emailClient: EmailClient | null = null;

/**
 * Returns the EmailClient singleton, or null if not in the Agent Workspace.
 *
 * Provides access to email operations:
 * - Data: getEmailData, getEmailThread
 * - Compose: createDraftEmail, sendEmail
 * - Events: onAcceptedEmail, onDraftEmailCreated
 */
export function getEmailClient(): EmailClient | null {
  if (emailClient) return emailClient;

  const provider = getConnectProvider();
  if (!provider) return null;

  emailClient = new EmailClient({ provider });
  return emailClient;
}
