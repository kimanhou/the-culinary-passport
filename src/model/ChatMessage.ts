/**
 * Shared ChatMessage type and message utilities.
 *
 * Requirements: 2.5, 1.5
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Returns true if the input is a non-empty, non-whitespace-only string.
 * Rejects empty strings and strings composed entirely of whitespace.
 */
export function isValidMessage(input: string): boolean {
  return input.trim().length > 0;
}

/**
 * Builds a welcome message for the chat panel, containing the city name.
 */
export function buildWelcomeMessage(cityName: string): ChatMessage {
  return {
    role: 'assistant',
    content: `Welcome! I'm your restaurant guide for ${cityName}. Ask me about restaurants, cuisines, or neighborhoods and I'll recommend places from our curated list. What are you in the mood for?`,
  };
}
