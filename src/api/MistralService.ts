/**
 * Service module for communicating with the Mistral AI via Cloudflare Worker proxy.
 */

import { ChatMessage } from 'model/ChatMessage';

export type { ChatMessage };

const API_URL = process.env.REACT_APP_CHAT_API_URL || '';

interface MistralChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export async function sendMessage(
  messages: ChatMessage[]
): Promise<string> {
  if (!API_URL) {
    throw new Error('Chat API URL not configured');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }

  const data: MistralChatResponse = await response.json();
  return data.choices[0].message.content;
}
