import { VoiceClient } from "@amazon-connect/voice";
import { getConnectProvider } from "../provider";

let voiceClient: VoiceClient | null = null;

/**
 * Returns the VoiceClient singleton, or null if not in the Agent Workspace.
 *
 * Provides access to voice-specific operations:
 * - Calls: createOutboundCall, getOutboundCallPermission, listDialableCountries
 * - Hold: holdParticipant, resumeParticipant, isParticipantOnHold,
 *   canResumeParticipant, canResumeSelf
 * - Conference: conferenceParticipants
 * - Phone: getInitialCustomerPhoneNumber
 * - Audio: getVoiceEnhancementMode, setVoiceEnhancementMode
 * - Events: onParticipantHold/Resume, onSelfHold/Resume,
 *   onCanResumeChanged, onVoiceEnhancementModeChanged
 */
export function getVoiceClient(): VoiceClient | null {
  if (voiceClient) return voiceClient;

  const provider = getConnectProvider();
  if (!provider) return null;

  voiceClient = new VoiceClient({ provider });
  return voiceClient;
}
