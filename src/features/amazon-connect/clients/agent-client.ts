import { AgentClient } from "@amazon-connect/contact";
import { getConnectProvider } from "../provider";

let agentClient: AgentClient | null = null;

/**
 * Returns the AgentClient singleton, or null if not in the Agent Workspace.
 *
 * Provides access to agent information and state management:
 * - Agent info: getARN, getName, getState, getExtension, getRoutingProfile
 * - State management: setAvailabilityState, setAvailabilityStateByName, setOffline
 * - Events: onStateChanged, onRoutingProfileChanged, onEnabledChannelListChanged
 */
export function getAgentClient(): AgentClient | null {
  if (agentClient) return agentClient;

  const provider = getConnectProvider();
  if (!provider) return null;

  agentClient = new AgentClient({ provider });
  return agentClient;
}
