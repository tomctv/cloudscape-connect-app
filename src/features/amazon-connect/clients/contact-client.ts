import { ContactClient } from "@amazon-connect/contact";
import { getConnectProvider } from "../provider";

let contactClient: ContactClient | null = null;

/**
 * Returns the ContactClient singleton, or null if not in the Agent Workspace.
 *
 * Provides access to contact lifecycle and data:
 * - Contact info: getContact, listContacts, getAttributes, getAttribute, getChannelType
 * - Actions: accept, transfer, clear, disconnectParticipant, addParticipant
 * - Participants: listParticipants, getParticipant, getParticipantState
 * - Queue: getQueue, getQueueTimestamp, getStateDuration
 * - Events: onConnected, onIncoming, onMissed, onCleared, onStartingAcw,
 *   onParticipantAdded, onParticipantDisconnected, onParticipantStateChanged
 */
export function getContactClient(): ContactClient | null {
  if (contactClient) return contactClient;

  const provider = getConnectProvider();
  if (!provider) return null;

  contactClient = new ContactClient({ provider });
  return contactClient;
}
