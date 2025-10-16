// src/types/ai-chat.ts

export interface AIChatResponse {
  reply: string;
}
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' ;
  content: string;
  created_at: string;
}