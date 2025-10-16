import client from './client';
import type { AIChatResponse, ChatMessage } from '@/types/ai-chat';

export async function sendMessageToAI(messages: ChatMessage[]): Promise<AIChatResponse> {
  try {
    const response = await client<AIChatResponse>('/ai/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
    return response;
  } catch (error: any) {
    console.error('AI Chat error:', error);
    throw new Error('Failed to send message to AI');
  }
}

export async function startNewConversation(message: string): Promise<{ conversation_id: string }> {
  try {
    const response = await client<{ conversation_id: string }>('/ai/start-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return response;
  } catch (error: any) {
    console.error('Start conversation error:', error);
    throw new Error('Failed to start new conversation');
  }
}



export async function saveChatMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<{ success: boolean }> {
  try {
    const response = await client<{ success: boolean }>('/ai/save-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, role, content }),
    });
    return response;
  } catch (error: any) {
    console.error('Save message error:', error);
    throw new Error('Failed to save message');
  }
}

export async function fetchConversations(): Promise<{ conversations: any[] }> {
  try {
    const response = await client<{ conversations: any[] }>('/ai/get-conversations');
    return response;
  } catch (error: any) {
    console.error('Fetch conversations error:', error);
    throw new Error('Failed to fetch conversations');
  }
}

export async function fetchMessages(conversationId: string): Promise<{ messages: any[] }> {
  try {
    const response = await client<{ messages: any[] }>(`/ai/get-messages/${conversationId}`);
    return response;
  } catch (error: any) {
    console.error('Fetch messages error:', error);
    throw new Error('Failed to fetch messages');
  }
}
