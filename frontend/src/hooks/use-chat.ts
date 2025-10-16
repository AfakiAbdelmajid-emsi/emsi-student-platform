import { useState } from 'react';

interface ChatResponse {
  message: string;
  error?: string;
}

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string): Promise<ChatResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement chat functionality with your backend
      // For now, return a mock response to prevent 404 errors
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      return {
        message: "Chat functionality is not yet implemented. Please connect to your backend API."
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
  };
} 