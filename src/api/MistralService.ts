/**
 * Service module for communicating with the Mistral AI chat completion API.
 *
 * Requirements: 6.1, 6.2, 6.3, 2.1
 */

import { ChatMessage } from 'model/ChatMessage';

export type { ChatMessage };

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

interface MistralChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export async function sendMessage(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.status}`);
  }

  const data: MistralChatResponse = await response.json();
  return data.choices[0].message.content;
}
